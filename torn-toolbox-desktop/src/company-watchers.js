export function normalizeCompanyWatchers(config) {
    var watchers = config.company?.watchers;
    if (Array.isArray(watchers) && watchers.length) {
        return watchers
            .filter(function(w) { return w && w.enabled !== false; })
            .map(function(w) {
                return {
                    id: w.id || 'w-' + Math.random().toString(36).slice(2, 8),
                    label: w.label || '未命名',
                    apiKey: (w.apiKey || '').trim(),
                    notify: w.notify || {}
                };
            })
            .filter(function(w) { return w.apiKey; });
    }
    if (config.tornApiKey) {
        return [{
            id: 'default',
            label: '默认',
            apiKey: config.tornApiKey.trim(),
            notify: config.notify || {}
        }];
    }
    return [];
}

export function maskWatcherForClient(watcher) {
    return {
        id: watcher.id,
        label: watcher.label,
        enabled: watcher.enabled !== false,
        hasApiKey: !!(watcher.apiKey && String(watcher.apiKey).trim()),
        apiKey: watcher.apiKey ? '***' + String(watcher.apiKey).slice(-4) : '',
        notify: watcher.notify || {}
    };
}

export function mergeWatcherConfig(incoming, previous, fallbackApiKey) {
    var prev = previous || {};
    var apiKey = (incoming.apiKey && String(incoming.apiKey).trim())
        ? incoming.apiKey.trim()
        : (prev.apiKey || '');
    if (!apiKey && fallbackApiKey && incoming.id === 'default') {
        apiKey = String(fallbackApiKey).trim();
    }
    return {
        id: incoming.id || prev.id || ('w-' + Date.now()),
        label: incoming.label || prev.label || '未命名',
        enabled: incoming.enabled !== false,
        apiKey: apiKey,
        notify: {
            desktop: incoming.notify?.desktop ?? prev.notify?.desktop ?? true,
            qq: {
                enabled: incoming.notify?.qq?.enabled ?? prev.notify?.qq?.enabled ?? true,
                type: incoming.notify?.qq?.type || prev.notify?.qq?.type || 'group',
                groupId: incoming.notify?.qq?.groupId ?? prev.notify?.qq?.groupId ?? '',
                atUserId: incoming.notify?.qq?.atUserId ?? prev.notify?.qq?.atUserId ?? '',
                userId: incoming.notify?.qq?.userId ?? prev.notify?.qq?.userId ?? ''
            }
        }
    };
}
