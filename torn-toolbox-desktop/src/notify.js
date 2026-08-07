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

export async function sendQqNotification(qqConfig, text) {
    if (!qqConfig?.enabled) return;
    var url = (qqConfig.url || '').trim();
    if (!url) return;
    var headers = { 'Content-Type': 'application/json; charset=utf-8' };
    if (qqConfig.token) headers.Authorization = 'Bearer ' + qqConfig.token;
    var resp = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ message: sanitizeQqText(text) })
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

export async function notifyCompanyApplications(notifyConfig, count) {
    var text = '发现 ' + count + ' 个新申请';
    var tasks = [];
    if (notifyConfig?.desktop) {
        tasks.push(sendDesktopNotification('Torn 公司新申请', text));
    }
    if (notifyConfig?.qq?.enabled) {
        tasks.push(sendQqNotification(notifyConfig.qq, '[Torn公司] ' + text));
    }
    await Promise.allSettled(tasks).then(function(results) {
        results.forEach(function(result) {
            if (result.status === 'rejected') {
                console.error('[notify]', result.reason?.message || result.reason);
            }
        });
    });
}
