import http from 'node:http';
import https from 'node:https';

function pickHeaders(reqHeaders, extra) {
    var out = {};
    ['content-type', 'authorization', 'accept', 'accept-language', 'cache-control'].forEach(function(key) {
        var val = reqHeaders[key];
        if (val) out[key] = val;
    });
    if (extra) Object.assign(out, extra);
    return out;
}

function readBody(req) {
    return new Promise(function(resolve, reject) {
        var chunks = [];
        req.on('data', function(chunk) { chunks.push(chunk); });
        req.on('end', function() { resolve(Buffer.concat(chunks)); });
        req.on('error', reject);
    });
}

function buildTargetUrl(service, reqUrl) {
    var base = new URL(service.internalUrl);
    var prefix = service.path.replace(/\/$/, '');
    var url = new URL(reqUrl, 'http://127.0.0.1');
    var subPath = url.pathname.slice(prefix.length) || '/';
    if (!subPath.startsWith('/')) subPath = '/' + subPath;
    var target = new URL(subPath + url.search, base.origin);
    if (service.adminToken) {
        target.searchParams.set('token', service.adminToken);
    }
    return target;
}

function injectPortalBar(html, servicePath) {
    if (!html.includes('<body')) return html;
    var bar = '<div class="portal-topbar"><a href="/">← 服务导航</a><span>Torn 工具箱</span></div>';
    var style = '<style>.portal-topbar{display:flex;align-items:center;gap:16px;padding:10px 16px;background:#1a1d24;border-bottom:1px solid #2a3140;font-family:system-ui,sans-serif}.portal-topbar a{color:#7eb6ff;text-decoration:none}.portal-topbar span{color:#9aa4b2;font-size:14px}</style>';
    var baseTag = '<base href="' + servicePath.replace(/\/$/, '') + '/">';
    return html
        .replace('<head>', '<head>' + baseTag + style)
        .replace(/<body([^>]*)>/, '<body$1>' + bar);
}

export async function proxyHttpRequest(service, req, res) {
    var target = buildTargetUrl(service, req.url);
    var lib = target.protocol === 'https:' ? https : http;
    var body = req.method === 'GET' || req.method === 'HEAD' ? null : await readBody(req);

    await new Promise(function(resolve) {
        var upstream = lib.request(target, {
            method: req.method,
            headers: pickHeaders(req.headers, { host: target.host })
        }, function(upstreamRes) {
            var headers = Object.assign({}, upstreamRes.headers);
            delete headers['content-security-policy'];
            var ctype = String(upstreamRes.headers['content-type'] || '');
            var isHtml = ctype.includes('text/html') && upstreamRes.statusCode === 200;
            var isStream = ctype.includes('text/event-stream');

            if (isStream) {
                res.writeHead(upstreamRes.statusCode, headers);
                upstreamRes.pipe(res);
                upstreamRes.on('end', resolve);
                return;
            }

            if (!isHtml) {
                res.writeHead(upstreamRes.statusCode, headers);
                upstreamRes.pipe(res);
                upstreamRes.on('end', resolve);
                return;
            }

            var chunks = [];
            upstreamRes.on('data', function(chunk) { chunks.push(chunk); });
            upstreamRes.on('end', function() {
                var buf = Buffer.concat(chunks);
                var html = injectPortalBar(buf.toString('utf8'), service.path);
                headers['content-length'] = Buffer.byteLength(html, 'utf8');
                res.writeHead(upstreamRes.statusCode, headers);
                res.end(html);
                resolve();
            });
        });

        upstream.on('error', function(err) {
            res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ ok: false, error: '上游服务不可用: ' + err.message }));
            resolve();
        });

        if (body && body.length) upstream.write(body);
        upstream.end();
    });
}

export function findProxyService(services, pathname) {
    return (services || []).find(function(service) {
        return service.type === 'proxy'
            && service.path
            && (pathname === service.path || pathname.startsWith(service.path + '/'));
    });
}
