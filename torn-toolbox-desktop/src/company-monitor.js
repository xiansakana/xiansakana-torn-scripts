import { EventEmitter } from 'node:events';
import { fetchCompanyApplications } from './torn-api.js';
import { notifyCompanyApplications } from './notify.js';

export class CompanyMonitor extends EventEmitter {
    constructor(getConfig) {
        super();
        this.getConfig = getConfig;
        this.timer = null;
        this.running = false;
        this.checks = 0;
        this.apps = 0;
        this.seen = new Set();
        this.applications = [];
        this.nextScanAt = null;
        this.statusMessage = '';
    }

    getState() {
        return {
            running: this.running,
            checks: this.checks,
            apps: this.apps,
            nextScanAt: this.nextScanAt,
            statusMessage: this.statusMessage,
            applications: this.applications
        };
    }

    start() {
        if (this.running) return;
        var config = this.getConfig();
        if (!config.tornApiKey) throw new Error('请填写 Torn API Key');
        var interval = Math.max(10, Number(config.company?.intervalSeconds) || 30);
        this.running = true;
        this.emit('state', this.getState());
        this.runOnce().catch(function(err) {
            this.emit('error', err.message);
        }.bind(this));
        this.timer = setInterval(function() {
            this.runOnce().catch(function(err) {
                this.emit('error', err.message);
            }.bind(this));
        }.bind(this), interval * 1000);
        this.scheduleNext(interval);
    }

    stop() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
        this.running = false;
        this.nextScanAt = null;
        this.statusMessage = '';
        this.emit('state', this.getState());
    }

    scheduleNext(intervalSeconds) {
        this.nextScanAt = Date.now() + intervalSeconds * 1000;
        this.emit('state', this.getState());
    }

    async runOnce() {
        var config = this.getConfig();
        this.checks++;
        this.statusMessage = '正在检查公司申请...';
        this.emit('state', this.getState());

        var applications = await fetchCompanyApplications(config.tornApiKey);
        var newApps = [];
        Object.keys(applications).forEach(function(id) {
            if (!this.seen.has(id)) {
                this.seen.add(id);
                this.apps++;
                var app = applications[id];
                newApps.push({
                    id: id,
                    name: app.name || '未知',
                    userId: app.userID || app.user_id,
                    level: app.level,
                    status: app.status,
                    expires: app.expires,
                    message: app.message || '无消息',
                    stats: app.stats || {},
                    detectedAt: Math.floor(Date.now() / 1000)
                });
            }
        }.bind(this));

        if (newApps.length) {
            this.applications = newApps.concat(this.applications).slice(0, 50);
            await notifyCompanyApplications(config.notify, newApps.length);
        }

        this.statusMessage = newApps.length ? '发现 ' + newApps.length + ' 个新申请' : '暂无新申请';
        this.emit('applications', this.applications);
        this.emit('state', this.getState());

        if (this.running) {
            var interval = Math.max(10, Number(config.company?.intervalSeconds) || 30);
            this.scheduleNext(interval);
        }
    }
}
