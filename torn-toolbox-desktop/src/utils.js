export const API_DELAY_MS = 1000;
export const RATE_LIMIT_RETRIES = 5;
export const WEAV3R_MARKETPLACE_URL = 'https://weav3r.dev/api/marketplace/';

export function sleep(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

export function toNumber(v) {
    if (v == null) return 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'object') return toNumber(v.id || v.user_id || v.player_id);
    return Number(String(v).replace(/[$,]/g, '')) || 0;
}

export function formatMoney(n) {
    var v = Math.round(toNumber(n));
    return (v < 0 ? '-' : '') + '$' + Math.abs(v).toLocaleString('en-US');
}

export function formatTime(ts) {
    return new Date(ts * 1000).toLocaleString('zh-CN');
}

export function normalizeItems(items) {
    if (Array.isArray(items)) return items;
    return Object.keys(items || {}).map(function(id) {
        var item = items[id] || {};
        item.id = item.id || Number(id);
        return item;
    });
}

export function sanitizeQqText(text) {
    return String(text).replace(/\$/g, '\uFF04');
}
