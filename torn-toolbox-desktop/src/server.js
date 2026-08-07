import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadConfig, saveConfig } from './config.js';
import { UndercutMonitor } from './undercut-monitor.js';
import { CompanyMonitor } from './company-monitor.js';
import { fetchItems } from './torn-api.js';
import { normalizeItems } from './utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');

var config = loadConfig();
var sseClients = new Set();
var itemsCache = null;

function getConfig() { return config; }

function broadcast(event, data) {
    var payload = 'event: ' + event + '\ndata: ' + JSON.stringify(data) + '\n\n';
    sseClients.forEach(function(res) { res.write(payload); });
}

var undercutMonitor = new UndercutMonitor(getConfig);
var companyMonitor = new CompanyMonitor(getConfig);

['state', 'alerts', 'applications', 'error'].forEach(function(eventName) {
    undercutMonitor.on(eventName, function(data) {
        if (eventName === 'state') broadcast('undercut', data);
        else if (eventName === 'alerts') broadcast('undercutAlerts', data);
        else if (eventName === 'error') broadcast('error', { source: 'undercut', message: data });
    });
    companyMonitor.on(eventName, function(data) {
        if (eventName === 'state') broadcast('company', data);
        else if (eventName === 'applications') broadcast('companyApps', data);
        else if (eventName === 'error') broadcast('error', { source: 'company', message: data });
    });
});

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

function json(res, status, body) {
    var text = JSON.stringify(body);
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(text, 'utf8')
    });
    res.end(text);
}

function serveStatic(req, res) {
    var urlPath = (req.url || '/').split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';
    var filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
    if (!filePath.startsWith(PUBLIC_DIR)) return json(res, 403, { ok: false, error: 'Forbidden' });
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return json(res, 404, { ok: false, error: 'Not Found' });
    var ext = path.extname(filePath);
    var types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
}

function openBrowser(url) {
    if (config.server?.openBrowser === false) return;
    var cmd = process.platform === 'win32' ? 'start "" "' + url + '"'
        : process.platform === 'darwin' ? 'open "' + url + '"'
        : 'xdg-open "' + url + '"';
    exec(cmd);
}

function getAdminToken() {
    return (config.server && config.server.adminToken) || '';
}

function parseCookies(req) {
    var out = {};
    (req.headers.cookie || '').split(';').forEach(function(part) {
        var i = part.indexOf('=');
        if (i < 0) return;
        var key = part.slice(0, i).trim();
        var val = part.slice(i + 1).trim();
        if (key) out[key] = decodeURIComponent(val);
    });
    return out;
}

function authorize(req, res, url) {
    var adminToken = getAdminToken();
    if (!adminToken) return true;
    var queryToken = url.searchParams.get('token') || '';
    if (queryToken === adminToken) {
        res.setHeader('Set-Cookie', 'ttb_admin=' + encodeURIComponent(adminToken) + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000');
        return true;
    }
    if ((req.headers.authorization || '') === 'Bearer ' + adminToken) return true;
    if (parseCookies(req).ttb_admin === adminToken) return true;
    return false;
}

function denyAccess(res) {
    res.writeHead(401, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Unauthorized: 请在 URL 加上 ?token=你的adminToken，例如 http://公网IP:8790/?token=xxx');
}

async function handleApi(req, res) {
    var url = new URL(req.url, 'http://127.0.0.1');

    if (req.method === 'GET' && url.pathname === '/api/state') {
        return json(res, 200, {
            ok: true,
            config: {
                tornApiKey: config.tornApiKey ? '***' + config.tornApiKey.slice(-4) : '',
                hasApiKey: !!config.tornApiKey,
                undercut: config.undercut,
                company: config.company,
                notify: {
                    desktop: config.notify?.desktop,
                    qq: {
                        enabled: config.notify?.qq?.enabled,
                        url: config.notify?.qq?.url,
                        hasToken: !!(config.notify?.qq?.token),
                        token: config.notify?.qq?.token ? '***' + config.notify.qq.token.slice(-4) : ''
                    }
                }
            },
            undercut: undercutMonitor.getState(),
            company: companyMonitor.getState()
        });
    }

    if (req.method === 'GET' && url.pathname === '/api/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
        });
        res.write('event: undercut\ndata: ' + JSON.stringify(undercutMonitor.getState()) + '\n\n');
        res.write('event: company\ndata: ' + JSON.stringify(companyMonitor.getState()) + '\n\n');
        res.write('event: undercutAlerts\ndata: ' + JSON.stringify(Array.from(undercutMonitor.alertMap.values())) + '\n\n');
        res.write('event: companyApps\ndata: ' + JSON.stringify(companyMonitor.applications) + '\n\n');
        sseClients.add(res);
        req.on('close', function() { sseClients.delete(res); });
        return;
    }

    if (req.method === 'GET' && url.pathname === '/api/items') {
        if (!config.tornApiKey) return json(res, 400, { ok: false, error: '请先填写 API Key' });
        try {
            if (!itemsCache) {
                var itemsObj = await fetchItems(config.tornApiKey);
                itemsCache = normalizeItems(itemsObj).map(function(item) {
                    return { id: item.id, name: item.name || item.title || ('Item #' + item.id) };
                });
                itemsCache.sort(function(a, b) { return String(a.name).localeCompare(String(b.name)); });
            }
            var items = itemsCache;
            var q = (url.searchParams.get('q') || '').trim().toLowerCase();
            if (q) {
                items = items.filter(function(item) {
                    return String(item.name).toLowerCase().includes(q) || String(item.id).includes(q);
                });
            }
            return json(res, 200, { ok: true, items: items, total: itemsCache.length });
        } catch (err) {
            return json(res, 500, { ok: false, error: err.message });
        }
    }

    if (req.method === 'POST' && url.pathname === '/api/config') {
        try {
            var body = await readJson(req);
            if (typeof body.tornApiKey === 'string' && body.tornApiKey.trim()) {
                config.tornApiKey = body.tornApiKey.trim();
                itemsCache = null;
            }
            if (body.undercut) config.undercut = { ...config.undercut, ...body.undercut };
            if (body.company) config.company = { ...config.company, ...body.company };
            if (body.notify) {
                var prevQq = config.notify?.qq || {};
                config.notify = { ...config.notify, ...body.notify };
                if (body.notify.qq) {
                    config.notify.qq = { ...prevQq, ...body.notify.qq };
                    if (!body.notify.qq.token || !String(body.notify.qq.token).trim()) {
                        config.notify.qq.token = prevQq.token || '';
                    }
                }
            }
            saveConfig(config);
            return json(res, 200, { ok: true });
        } catch (err) {
            return json(res, 500, { ok: false, error: err.message });
        }
    }

    if (req.method === 'POST' && url.pathname === '/api/undercut/start') {
        try { undercutMonitor.start(); return json(res, 200, { ok: true }); }
        catch (err) { return json(res, 400, { ok: false, error: err.message }); }
    }

    if (req.method === 'POST' && url.pathname === '/api/undercut/stop') {
        undercutMonitor.stop();
        return json(res, 200, { ok: true });
    }

    if (req.method === 'POST' && url.pathname === '/api/company/start') {
        try { companyMonitor.start(); return json(res, 200, { ok: true }); }
        catch (err) { return json(res, 400, { ok: false, error: err.message }); }
    }

    if (req.method === 'POST' && url.pathname === '/api/company/stop') {
        companyMonitor.stop();
        return json(res, 200, { ok: true });
    }

    return json(res, 404, { ok: false, error: 'Not Found' });
}

var server = http.createServer(async function(req, res) {
    var url = new URL(req.url, 'http://127.0.0.1');
    if (!authorize(req, res, url)) return denyAccess(res);
    if (url.pathname.startsWith('/api/')) return handleApi(req, res);
    return serveStatic(req, res);
});

var host = config.server?.host || '127.0.0.1';
var port = config.server?.port || 8790;

server.listen(port, host, function() {
    var url = 'http://' + (host === '0.0.0.0' ? '127.0.0.1' : host) + ':' + port;
    console.log('Torn 工具箱 Desktop 已启动: ' + url);
    if (host === '0.0.0.0') {
        console.log('外网访问: http://<公网IP>:' + port + (getAdminToken() ? '?token=<adminToken>' : ''));
    }
    console.log('压价助手 / 公司监听 — 在浏览器中打开上述地址');
    openBrowser(url);
    if (config.tornApiKey && config.undercut && config.undercut.autoStart) {
        try { undercutMonitor.start(); }
        catch (err) { console.error('压价助手自动启动失败:', err.message); }
    }
    if (config.tornApiKey && config.company && config.company.autoStart) {
        try { companyMonitor.start(); }
        catch (err) { console.error('公司监听自动启动失败:', err.message); }
    }
});

process.on('SIGINT', function() {
    undercutMonitor.stop();
    companyMonitor.stop();
    process.exit(0);
});
