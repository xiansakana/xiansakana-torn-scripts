import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from './config.js';
import {
    clearSessionCookie,
    createSessionCookie,
    getSession,
    verifyLogin
} from './auth.js';
import { findProxyService, getServiceEntryHref, proxyHttpRequest, proxyWebSocket } from './proxy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');
var config = loadConfig();

function json(res, status, body) {
    var text = JSON.stringify(body);
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(text, 'utf8')
    });
    res.end(text);
}

function redirect(res, location, setCookie) {
    var headers = { Location: location };
    if (setCookie) headers['Set-Cookie'] = setCookie;
    res.writeHead(302, headers);
    res.end();
}

function readJson(req) {
    return new Promise(function(resolve, reject) {
        var chunks = [];
        req.on('data', function(chunk) { chunks.push(chunk); });
        req.on('end', function() {
            if (!chunks.length) return resolve({});
            try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
            catch (e) { reject(new Error('请求体不是合法 JSON')); }
        });
        req.on('error', reject);
    });
}

function serveStatic(filePath, res) {
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        return false;
    }
    var ext = path.extname(filePath);
    var types = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8'
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
    return true;
}

function getSessionSecret() {
    return config.auth?.sessionSecret || config.auth?.password || 'portal';
}

function requireAuth(req, res) {
    var session = getSession(req, getSessionSecret());
    if (!session) {
        redirect(res, '/login.html');
        return null;
    }
    return session;
}

function publicServices() {
    return (config.services || []).map(function(service) {
        var item = {
            id: service.id,
            title: service.title,
            description: service.description,
            type: service.type,
            icon: service.icon || '📦',
            newTab: !!service.newTab
        };
        if (service.type === 'proxy') {
            item.path = getServiceEntryHref(service);
        } else if (service.type === 'external') {
            item.url = service.url;
        }
        return item;
    });
}

async function handleApi(req, res, url, session) {
    if (req.method === 'GET' && url.pathname === '/api/me') {
        return json(res, 200, { ok: true, username: session.username });
    }

    if (req.method === 'GET' && url.pathname === '/api/services') {
        return json(res, 200, { ok: true, services: publicServices() });
    }

    if (req.method === 'POST' && url.pathname === '/api/logout') {
        res.setHeader('Set-Cookie', clearSessionCookie());
        return json(res, 200, { ok: true });
    }

    return json(res, 404, { ok: false, error: 'Not Found' });
}

async function handleLoginApi(req, res) {
    if (req.method !== 'POST' || new URL(req.url, 'http://127.0.0.1').pathname !== '/api/login') {
        return false;
    }
    try {
        var body = await readJson(req);
        if (!verifyLogin(body.username, body.password, config)) {
            return json(res, 401, { ok: false, error: '用户名或密码错误' });
        }
        res.setHeader('Set-Cookie', createSessionCookie(body.username, getSessionSecret()));
        return json(res, 200, { ok: true });
    } catch (err) {
        return json(res, 400, { ok: false, error: err.message });
    }
}

var server = http.createServer(async function(req, res) {
    var url = new URL(req.url, 'http://127.0.0.1');

    if (url.pathname === '/api/login') {
        await handleLoginApi(req, res);
        return;
    }

    if (url.pathname.startsWith('/api/')) {
        var session = requireAuth(req, res);
        if (!session) return;
        return handleApi(req, res, url, session);
    }

    var proxyService = findProxyService(config.services, url.pathname);
    if (proxyService) {
        var proxySession = requireAuth(req, res);
        if (!proxySession) return;
        if (proxyService.adminToken && !url.searchParams.get('token')) {
            var redir = new URL(req.url, 'http://127.0.0.1');
            redir.searchParams.set('token', proxyService.adminToken);
            return redirect(res, redir.pathname + redir.search);
        }
        if (url.pathname.endsWith('/web_login')) {
            var entry = new URL(getServiceEntryHref(proxyService) + (proxyService.adminToken ? '?token=' + encodeURIComponent(proxyService.adminToken) : ''), 'http://127.0.0.1');
            return redirect(res, entry.pathname + entry.search);
        }
        return proxyHttpRequest(proxyService, req, res);
    }

    if (url.pathname === '/' || url.pathname === '/index.html') {
        var homeSession = requireAuth(req, res);
        if (!homeSession) return;
        return serveStatic(path.join(PUBLIC_DIR, 'dashboard.html'), res);
    }

    if (url.pathname === '/login' || url.pathname === '/login.html') {
        if (getSession(req, getSessionSecret())) {
            return redirect(res, '/');
        }
        if (serveStatic(path.join(PUBLIC_DIR, 'login.html'), res)) return;
    }

    var staticPath = path.normalize(path.join(PUBLIC_DIR, url.pathname));
    if (staticPath.startsWith(PUBLIC_DIR) && serveStatic(staticPath, res)) return;

    json(res, 404, { ok: false, error: 'Not Found' });
});

server.on('upgrade', function(req, socket, head) {
    var url = new URL(req.url, 'http://127.0.0.1');
    if (!getSession(req, getSessionSecret())) {
        socket.destroy();
        return;
    }
    var wsService = findProxyService(config.services, url.pathname);
    if (!wsService) {
        socket.destroy();
        return;
    }
    proxyWebSocket(wsService, req, socket, head);
});

var host = config.server?.host || '127.0.0.1';
var port = config.server?.port || 8080;

server.listen(port, host, function() {
    console.log('服务导航门户已启动: http://' + (host === '0.0.0.0' ? '127.0.0.1' : host) + ':' + port);
    if (host === '0.0.0.0' && port === 80) {
        console.log('外网访问: http://<公网IP>/');
    }
    console.log('登录后可在卡片中进入各服务（含 Torn 压价助手配置）');
});

process.on('SIGINT', function() { process.exit(0); });
