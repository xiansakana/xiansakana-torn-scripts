import notifier from 'node-notifier';
import { sanitizeQqText } from './utils.js';

export async function sendDesktopNotification(title, text) {
    return new Promise(function(resolve) {
        notifier.notify({
            title: title,
            message: text,
            sound: true,
            wait: false
        }, resolve);
    });
}

function buildQqPayload(qqConfig, text) {
    var payload = { message: sanitizeQqText(text) };
    if (qqConfig.type) payload.type = qqConfig.type;
    if (qqConfig.groupId) payload.groupId = String(qqConfig.groupId);
    if (qqConfig.userId) payload.userId = String(qqConfig.userId);
    if (qqConfig.atUserId) payload.atUserId = String(qqConfig.atUserId);
    return payload;
}

export function buildWatcherQqConfig(globalNotify, watcherNotify) {
    if (!watcherNotify?.qq?.enabled) return null;
    var globalQq = globalNotify?.qq || {};
    if (!globalQq.url) return null;
    return {
        enabled: true,
        url: globalQq.url,
        token: globalQq.token,
        type: watcherNotify.qq.type || 'group',
        groupId: watcherNotify.qq.groupId || '',
        userId: watcherNotify.qq.userId || '',
        atUserId: watcherNotify.qq.atUserId || ''
    };
}

export async function sendQqNotification(qqConfig, text) {
    if (!qqConfig?.enabled) return;
    var url = (qqConfig.url || '').trim();
    if (!url) return;
    var headers = { 'Content-Type': 'application/json; charset=utf-8' };
    if (qqConfig.token) headers.Authorization = 'Bearer ' + qqConfig.token;
    var resp = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(buildQqPayload(qqConfig, text))
    });
    if (!resp.ok) {
        var body = await resp.text();
        throw new Error('QQ 推送失败 (' + resp.status + '): ' + body);
    }
}

export async function notifyUndercutAlert(notifyConfig, alert, alertText) {
    var sourceLabel = alert.source === 'Bazaar' ? 'Bazaar' : 'Item Market';
    var title = 'Torn 压价 · ' + sourceLabel;
    var tasks = [];
    if (notifyConfig?.desktop) {
        tasks.push(sendDesktopNotification(title, alertText));
    }
    if (notifyConfig?.qq?.enabled) {
        tasks.push(sendQqNotification(notifyConfig.qq, '[Torn压价] ' + alertText));
    }
    await Promise.allSettled(tasks).then(function(results) {
        results.forEach(function(result) {
            if (result.status === 'rejected') {
                console.error('[notify]', result.reason?.message || result.reason);
            }
        });
    });
}

function formatCompanyApplicationText(label, newApps) {
    var prefix = label ? '[' + label + '] ' : '';
    var summary = '发现 ' + newApps.length + ' 个新申请';
    var details = newApps.map(function(app) {
        return app.name + ' (ID ' + app.userId + ')';
    }).join('、');
    return prefix + summary + (details ? '：' + details : '');
}

export async function notifyCompanyApplications(globalNotify, watcherNotify, label, newApps) {
    var text = formatCompanyApplicationText(label, newApps);
    var tasks = [];
    if (watcherNotify?.desktop !== false && globalNotify?.desktop) {
        tasks.push(sendDesktopNotification('Torn 公司新申请', text));
    }
    var qqConfig = buildWatcherQqConfig(globalNotify, watcherNotify);
    if (qqConfig) {
        tasks.push(sendQqNotification(qqConfig, '[Torn公司] ' + text));
    }
    await Promise.allSettled(tasks).then(function(results) {
        results.forEach(function(result) {
            if (result.status === 'rejected') {
                console.error('[notify]', result.reason?.message || result.reason);
            }
        });
    });
}
