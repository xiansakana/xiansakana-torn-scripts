#!/usr/bin/env node

/**
 * Torn 公司申请监控守护进程
 * 支持多个API Key，通过邮件发送通知
 * 
 * 使用方法：
 * 1. 本地运行：npm install && node company-monitor-daemon.js
 * 2. 云平台部署：配置环境变量后直接部署
 */

// 加载 .env 文件（如果存在）
require('dotenv').config();

const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// 配置文件路径
const CONFIG_FILE = path.join(__dirname, 'config.json');
const STATE_FILE = path.join(__dirname, 'company-monitor-state.json');

// 从环境变量或配置文件加载配置
function loadConfig() {
    // 优先使用环境变量
    if (process.env.TORN_API_KEYS) {
        console.log('使用环境变量配置');
        return {
            tornApiKeys: process.env.TORN_API_KEYS.split(',').map(k => k.trim()),
            checkInterval: parseInt(process.env.CHECK_INTERVAL) || 60,
            email: {
                enabled: process.env.EMAIL_ENABLED === 'true',
                service: process.env.EMAIL_SERVICE || 'qq',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                to: process.env.EMAIL_TO,
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER
            },
            webhook: {
                enabled: process.env.WEBHOOK_ENABLED === 'true',
                url: process.env.WEBHOOK_URL
            }
        };
    }
    
    // 使用配置文件
    if (fs.existsSync(CONFIG_FILE)) {
        console.log('使用配置文件');
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
    
    return null;
}

// 默认配置
const DEFAULT_CONFIG = {
    tornApiKeys: ['YOUR_API_KEY_1', 'YOUR_API_KEY_2'],
    checkInterval: 60,
    email: {
        enabled: true,
        service: 'qq',
        auth: {
            user: 'your-email@qq.com',
            pass: 'your-auth-code'
        },
        to: 'recipient@163.com',
        from: 'your-email@qq.com'
    },
    webhook: {
        enabled: false,
        url: 'https://discord.com/api/webhooks/...'
    }
};

class CompanyMonitor {
    constructor(config) {
        this.config = config;
        this.seenAppIds = new Set();
        this.checkCount = 0;
        this.totalNewApps = 0;
        this.isRunning = false;
        this.timer = null;
        
        // 初始化邮件发送器
        if (config.email.enabled && config.email.auth.user && config.email.auth.pass) {
            console.log('初始化邮件发送器...');
            console.log(`  服务: ${config.email.service}`);
            console.log(`  用户: ${config.email.auth.user}`);
            
            let transportConfig;
            
            if (config.email.service === 'gmail') {
                transportConfig = {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: config.email.auth,
                    tls: { ciphers: 'SSLv3', rejectUnauthorized: false }
                };
            } else if (config.email.service === 'qq') {
                transportConfig = {
                    host: 'smtp.qq.com',
                    port: 465,
                    secure: true,
                    auth: config.email.auth,
                    tls: { rejectUnauthorized: false }
                };
            } else if (config.email.service === '163') {
                transportConfig = {
                    host: 'smtp.163.com',
                    port: 465,
                    secure: true,
                    auth: config.email.auth
                };
            } else {
                transportConfig = {
                    service: config.email.service,
                    auth: config.email.auth
                };
            }
            
            this.emailTransporter = nodemailer.createTransport(transportConfig);
            
            // 验证邮件配置
            this.emailTransporter.verify((error, success) => {
                if (error) {
                    console.error('❌ 邮件配置验证失败：', error.message);
                } else {
                    console.log('✓ 邮件配置验证成功');
                }
            });
        }
        
        // 加载之前的状态
        this.loadState();
    }
    
    loadState() {
        try {
            if (fs.existsSync(STATE_FILE)) {
                const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
                this.seenAppIds = new Set(state.seenAppIds || []);
                console.log(`已加载状态：${this.seenAppIds.size} 个已知申请`);
            }
        } catch (err) {
            console.error('加载状态失败：', err.message);
        }
    }
    
    saveState() {
        try {
            const state = {
                seenAppIds: Array.from(this.seenAppIds),
                lastUpdate: new Date().toISOString()
            };
            fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
        } catch (err) {
            console.error('保存状态失败：', err.message);
        }
    }
    
    async fetchCompanyApplications(apiKey) {
        const url = `https://api.torn.com/company/?selections=applications&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.error || 'API 返回错误');
        }
        
        return data.applications || {};
    }
    
    async sendEmailNotification(apps) {
        if (!this.config.email.enabled || !this.emailTransporter) {
            return;
        }
        
        const subject = `🏢 发现 ${apps.length} 个新的公司申请！`;
        
        let html = '<h2>Torn 公司申请通知</h2>';
        html += '<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; font-family: Arial;">';
        html += '<tr style="background: #f0f0f0;"><th>申请人</th><th>等级</th><th>智力</th><th>耐力</th><th>体力劳动</th><th>状态</th><th>过期时间</th></tr>';
        
        apps.forEach(app => {
            const expiresTime = new Date(app.data.expires * 1000).toLocaleString('zh-CN');
            const intelligence = app.data.stats?.intelligence?.toLocaleString() || '未知';
            const endurance = app.data.stats?.endurance?.toLocaleString() || '未知';
            const manualLabor = app.data.stats?.manual_labor?.toLocaleString() || '未知';
            
            html += `<tr>
                <td><strong>${app.data.name || '未知'}</strong> (ID: ${app.data.userID || '未知'})</td>
                <td>${app.data.level || '未知'}</td>
                <td>${intelligence}</td>
                <td>${endurance}</td>
                <td>${manualLabor}</td>
                <td>${app.data.status || '未知'}</td>
                <td>${expiresTime}</td>
            </tr>`;
        });
        
        html += '</table>';
        html += `<p style="color: #666; margin-top: 20px;">检查时间：${new Date().toLocaleString('zh-CN')}</p>`;
        
        const mailOptions = {
            from: this.config.email.from,
            to: this.config.email.to,
            subject: subject,
            html: html
        };
        
        try {
            console.log(`正在发送邮件到 ${this.config.email.to}...`);
            
            const sendPromise = this.emailTransporter.sendMail(mailOptions);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('邮件发送超时（30秒）')), 30000)
            );
            
            await Promise.race([sendPromise, timeoutPromise]);
            console.log(`✉️  邮件通知已发送到 ${this.config.email.to}`);
        } catch (err) {
            console.error('❌ 发送邮件失败：', err.message);
        }
    }
    
    async sendWebhookNotification(apps) {
        if (!this.config.webhook.enabled || !this.config.webhook.url) {
            return;
        }
        
        const content = apps.map(app => {
            return `**${app.data.name}** (Lv.${app.data.level}) - 智力: ${app.data.stats?.intelligence?.toLocaleString() || '?'}`;
        }).join('\n');
        
        const payload = {
            content: `🏢 发现 ${apps.length} 个新的公司申请！\n\n${content}`
        };
        
        try {
            await fetch(this.config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            console.log('📢 Webhook 通知已发送');
        } catch (err) {
            console.error('发送 Webhook 失败：', err.message);
        }
    }
    
    async check() {
        try {
            this.checkCount++;
            console.log(`\n[${new Date().toLocaleString('zh-CN')}] 第 ${this.checkCount} 次检查...`);
            
            const allNewApps = [];
            
            // 遍历所有 API Key
            for (let i = 0; i < this.config.tornApiKeys.length; i++) {
                const apiKey = this.config.tornApiKeys[i];
                console.log(`  检查 API Key ${i + 1}/${this.config.tornApiKeys.length}...`);
                
                try {
                    const applications = await this.fetchCompanyApplications(apiKey);
                    const appIds = Object.keys(applications);
                    
                    for (const appId of appIds) {
                        if (!this.seenAppIds.has(appId)) {
                            this.seenAppIds.add(appId);
                            this.totalNewApps++;
                            allNewApps.push({ id: appId, data: applications[appId] });
                            
                            console.log(`    ✓ 新申请: ${applications[appId].name} (Lv.${applications[appId].level})`);
                        }
                    }
                } catch (err) {
                    console.error(`    ❌ API Key ${i + 1} 检查失败：${err.message}`);
                }
            }
            
            if (allNewApps.length > 0) {
                console.log(`\n🏢 发现 ${allNewApps.length} 个新申请！`);
                
                // 发送通知
                await this.sendEmailNotification(allNewApps);
                await this.sendWebhookNotification(allNewApps);
                
                // 保存状态
                this.saveState();
            } else {
                console.log('  没有新的申请');
            }
            
            console.log(`总计：已检查 ${this.checkCount} 次，发现 ${this.totalNewApps} 个新申请`);
            
        } catch (err) {
            console.error('❌ 检查失败：', err.message);
        }
    }
    
    start() {
        if (this.isRunning) {
            console.log('监控已在运行中');
            return;
        }
        
        this.isRunning = true;
        console.log('='.repeat(60));
        console.log('🚀 Torn 公司申请监控守护进程已启动');
        console.log('='.repeat(60));
        console.log(`API Keys 数量：${this.config.tornApiKeys.length}`);
        console.log(`检查间隔：${this.config.checkInterval} 秒`);
        console.log(`邮件通知：${this.config.email.enabled ? '✓ 启用' : '✗ 禁用'}`);
        console.log(`Webhook：${this.config.webhook.enabled ? '✓ 启用' : '✗ 禁用'}`);
        console.log('='.repeat(60));
        
        // 立即执行一次检查
        this.check();
        
        // 设置定时检查
        this.timer = setInterval(() => {
            this.check();
        }, this.config.checkInterval * 1000);
    }
    
    stop() {
        if (!this.isRunning) {
            return;
        }
        
        this.isRunning = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.saveState();
        console.log('\n监控已停止');
    }
}

// 主程序
function main() {
    const config = loadConfig();
    
    if (!config) {
        console.log('未找到配置，正在创建默认配置文件...');
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
        console.log(`\n请编辑 ${CONFIG_FILE} 文件，填入你的配置信息：`);
        console.log('1. tornApiKeys: 你的 Torn API Keys（数组，支持多个）');
        console.log('2. email.auth: 你的邮箱账号和密码');
        console.log('3. email.to: 接收通知的邮箱地址');
        console.log('\n或者设置环境变量：');
        console.log('- TORN_API_KEYS=key1,key2,key3 （用逗号分隔多个key）');
        console.log('- EMAIL_ENABLED=true');
        console.log('- EMAIL_SERVICE=qq');
        console.log('- EMAIL_USER');
        console.log('- EMAIL_PASS');
        console.log('- EMAIL_TO');
        process.exit(0);
    }
    
    // 验证配置
    if (!config.tornApiKeys || config.tornApiKeys.length === 0) {
        console.error('❌ 请配置至少一个 Torn API Key！');
        process.exit(1);
    }
    
    // 创建并启动监控
    const monitor = new CompanyMonitor(config);
    monitor.start();
    
    // 优雅退出
    process.on('SIGINT', () => {
        console.log('\n\n收到退出信号...');
        monitor.stop();
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        monitor.stop();
        process.exit(0);
    });
}

// 运行
if (require.main === module) {
    main();
}

module.exports = CompanyMonitor;
