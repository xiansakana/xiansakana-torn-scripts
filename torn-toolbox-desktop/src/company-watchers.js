export function normalizeQqTargets(qq) {
    if (!qq) return [];
    if (Array.isArray(qq.targets) && qq.targets.length) {
        return qq.targets.map(function(target) {
            return {
                id: target.id || ('t-' + Math.random().toString(36).slice(2, 8)),
                type: target.type || 'group',
                groupId: String(target.groupId || '').trim(),
                atUserId: String(target.atUserId || '').trim(),
                userId: String(target.userId || '').trim()
            };
        });
    }
    if (qq.groupId || qq.userId) {
        return [{
            id: 'legacy',
            type: qq.type || (qq.userId && !qq.groupId ? 'private' : 'group'),
            groupId: String(qq.groupId || '').trim(),
            atUserId: String(qq.atUserId || '').trim(),
            userId: String(qq.userId || '').trim()
        }];
    }
    return [];
}

export function mergeQqTargets(incoming, previous) {
    var prevList = normalizeQqTargets(previous);
    if (!Array.isArray(incoming)) {
        return prevList.length ? prevList : normalizeQqTargets(previous);
    }
    return incoming.map(function(target, index) {
        var prev = prevList.find(function(item) { return item.id === target.id; }) || prevList[index] || {};
        return {
            id: target.id || prev.id || ('t-' + Date.now() + '-' + index),
            type: target.type || prev.type || 'group',
            groupId: String(target.groupId ?? prev.groupId ?? '').trim(),
            atUserId: String(target.atUserId ?? prev.atUserId ?? '').trim(),
            userId: String(target.userId ?? prev.userId ?? '').trim()
        };
    });
}

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
        notify: {
            desktop: watcher.notify?.desktop !== false,
            qq: {
                enabled: watcher.notify?.qq?.enabled !== false,
                targets: normalizeQqTargets(watcher.notify?.qq)
            }
        }
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
    var prevQq = prev.notify?.qq || {};
    var incomingQq = incoming.notify?.qq || {};
    return {
        id: incoming.id || prev.id || ('w-' + Date.now()),
        label: incoming.label || prev.label || '未命名',
        enabled: incoming.enabled !== false,
        apiKey: apiKey,
        notify: {
            desktop: incoming.notify?.desktop ?? prev.notify?.desktop ?? true,
            qq: {
                enabled: incomingQq.enabled ?? prevQq.enabled ?? true,
                targets: mergeQqTargets(incomingQq.targets, prevQq)
            }
        }
    };
}
