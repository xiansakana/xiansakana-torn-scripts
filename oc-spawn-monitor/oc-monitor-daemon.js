#!/usr/bin/env node

/**
 * Torn OC Spawn 监控守护进程
 * 可以在服务器或本地持续运行，通过邮件发送通知
 * 
 * 使用方法：
 * 1. 本地运行：npm install && node oc-monitor-daemon.js
 * 2. Railway 部署：配置环境变量后直接部署
 */

// 加载 .env 文件（如果存在）
require('dotenv').config();

const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// 配置文件路径
const CONFIG_FILE = path.join(__dirname, 'config.json');
const STATE_FILE = path.join(__dirname, 'oc-monitor-state.json');

// 从环境变量或配置文件加载配置
function loadConfig() {
    // 优先使用环境变量（适用于 Railway 等云平台）
    if (process.env.TORN_API_KEY) {
        console.log('使用环境变量配置');
        return {
            tornApiKey: process.env.TORN_API_KEY,
            checkInterval: parseInt(process.env.CHECK_INTERVAL) || 60,
            email: {
                enabled: process.env.EMAIL_ENABLED === 'true',
                service: process.env.EMAIL_SERVICE || 'gmail',
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
            },
            filters: {
                minDifficulty: process.env.FILTER_MIN_DIFFICULTY || 'simple',
                minScope: parseInt(process.env.FILTER_MIN_SCOPE) || 1,
                players: process.env.FILTER_PLAYERS ? process.env.FILTER_PLAYERS.split(',') : []
            }
        };
    }
    
    // 使用配置文件（本地运行）
    if (fs.existsSync(CONFIG_FILE)) {
        console.log('使用配置文件');
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
    
    // 返回默认配置
    return null;
}

// 默认配置（仅用于生成示例配置文件）
const DEFAULT_CONFIG = {
    tornApiKey: 'YOUR_API_KEY_HERE',
    checkInterval: 60,
    email: {
        enabled: true,
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-app-password'
        },
        to: 'recipient@example.com',
        from: 'your-email@gmail.com'
    },
    webhook: {
        enabled: false,
        url: 'https://discord.com/api/webhooks/...'
    },
    filters: {
        minDifficulty: 'simple',
        minScope: 1,
        players: []
    }
};

class OCMonitor {
    constructor(config) {
        this.config = config;
        this.seenOcIds = new Set();
        this.checkCount = 0;
        this.totalNewOCs = 0;
        this.isRunning = false;
        this.timer = null;
        
        // 初始化邮件发送器
        if (config.email.enabled && config.email.auth.user && config.email.auth.pass) {
            console.log('初始化邮件发送器...');
            console.log(`  服务: ${config.email.service}`);
            console.log(`  用户: ${config.email.auth.user}`);
            console.log(`  密码长度: ${config.email.auth.pass.length} 字符`);
            
            // 根据不同邮件服务使用不同配置
            let transportConfig;
            
            if (config.email.service === 'gmail') {
                // Gmail 使用显式 SMTP 配置
                transportConfig = {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // 使用 STARTTLS
                    auth: config.email.auth,
                    tls: {
                        ciphers: 'SSLv3',
                        rejectUnauthorized: false
                    }
                };
            } else if (config.email.service === 'qq') {
                transportConfig = {
                    host: 'smtp.qq.com',
                    port: 465,
                    secure: true,
                    auth: config.email.auth,
                    tls: {
                        rejectUnauthorized: false
                    }
                };
            } else if (config.email.service === '163') {
                transportConfig = {
                    host: 'smtp.163.com',
                    port: 465,
                    secure: true,
                    auth: config.email.auth
                };
            } else {
                // 其他服务使用默认配置
                transportConfig = {
                    service: config.email.service,
                    auth: config.email.auth
                };
            }
            
            this.emailTransporter = nodemailer.createTransport(transportConfig);
            
            // 验证邮件配置（异步，不阻塞启动）
            this.emailTransporter.verify((error, success) => {
                if (error) {
                    console.error('❌ 邮件配置验证失败：', error.message);
                    console.error('   这可能不影响实际发送，将在发送时重试');
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
                this.seenOcIds = new Set(state.seenOcIds || []);
                console.log(`已加载状态：${this.seenOcIds.size} 个已知 OC`);
            }
        } catch (err) {
            console.error('加载状态失败：', err.message);
        }
    }
    
    saveState() {
        try {
            const state = {
                seenOcIds: Array.from(this.seenOcIds),
                lastUpdate: new Date().toISOString()
            };
            fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
        } catch (err) {
            console.error('保存状态失败：', err.message);
        }
    }
    
    async fetchFactionNews() {
        const url = `https://api.torn.com/v2/faction/news?striptags=true&limit=100&sort=DESC&cat=crime&key=${this.config.tornApiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.error || 'API 返回错误');
        }
        
        return data.news || [];
    }
    
    parseOCFromNews(newsItem) {
        // 匹配 "XXX used X scope spawning the XXX scenario YYY"
        const match = newsItem.text.match(/(.+?) used (\d+) scope spawning the (\w+) scenario (.+?) \[view\]/);
        if (match) {
            return {
                type: 'spawned',
                player: match[1],
                scopeCount: parseInt(match[2]),
                difficulty: match[3],
                crimeName: match[4],
                newsId: newsItem.id,
                timestamp: newsItem.timestamp,
                text: newsItem.text
            };
        }
        return null;
    }
    
    shouldNotify(oc) {
        const filters = this.config.filters;
        
        // 检查 scope 数量
        if (oc.scopeCount < filters.minScope) {
            return false;
        }
        
        // 检查难度
        const difficultyLevels = { simple: 1, intermediate: 2, advanced: 3 };
        const minLevel = difficultyLevels[filters.minDifficulty] || 1;
        const ocLevel = difficultyLevels[oc.difficulty] || 1;
        if (ocLevel < minLevel) {
            return false;
        }
        
        // 检查玩家过滤
        if (filters.players.length > 0 && !filters.players.includes(oc.player)) {
            return false;
        }
        
        return true;
    }
    
    async sendEmailNotification(ocs) {
        if (!this.config.email.enabled || !this.emailTransporter) {
            return;
        }
        
        const subject = `🎯 发现 ${ocs.length} 个新 OC Spawn！`;
        
        let html = '<h2>Torn OC Spawn 通知</h2>';
        html += '<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; font-family: Arial;">';
        html += '<tr style="background: #f0f0f0;"><th>OC 名称</th><th>难度</th><th>Scope</th><th>发起人</th><th>时间</th></tr>';
        
        ocs.forEach(oc => {
            const difficultyColors = {
                simple: '#28a745',
                intermediate: '#ffc107',
                advanced: '#dc3545'
            };
            const color = difficultyColors[oc.difficulty] || '#6c757d';
            const timeStr = new Date(oc.timestamp * 1000).toLocaleString('zh-CN');
            
            html += `<tr>
                <td><strong>${oc.crimeName}</strong></td>
                <td style="color: ${color}; font-weight: bold;">${oc.difficulty}</td>
                <td>${oc.scopeCount}</td>
                <td>${oc.player}</td>
                <td>${timeStr}</td>
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
            console.log(`使用邮箱服务: ${this.config.email.service}`);
            console.log(`发件人: ${this.config.email.from}`);
            
            // 添加 30 秒超时
            const sendPromise = this.emailTransporter.sendMail(mailOptions);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('邮件发送超时（30秒）')), 30000)
            );
            
            await Promise.race([sendPromise, timeoutPromise]);
            console.log(`✉️  邮件通知已发送到 ${this.config.email.to}`);
        } catch (err) {
            console.error('❌ 发送邮件失败：', err.message);
            console.error('错误详情：', err);
            console.error('请检查：');
            console.error('  1. Gmail 应用专用密码是否正确（16位，无空格）');
            console.error('  2. Gmail 账号是否开启了"两步验证"和"应用专用密码"');
            console.error('  3. 网络连接是否正常');
            console.error('  4. 尝试使用其他邮箱服务（如 QQ、163）');
        }
    }
    
    async sendWebhookNotification(ocs) {
        if (!this.config.webhook.enabled || !this.config.webhook.url) {
            return;
        }
        
        const content = ocs.map(oc => {
            return `**${oc.crimeName}** (${oc.difficulty}) - Scope: ${oc.scopeCount} - ${oc.player}`;
        }).join('\n');
        
        const payload = {
            content: `🎯 发现 ${ocs.length} 个新 OC Spawn！\n\n${content}`
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
            
            const newsList = await this.fetchFactionNews();
            const newOCs = [];
            
            for (const newsItem of newsList) {
                if (!this.seenOcIds.has(newsItem.id)) {
                    const ocInfo = this.parseOCFromNews(newsItem);
                    if (ocInfo && this.shouldNotify(ocInfo)) {
                        this.seenOcIds.add(newsItem.id);
                        this.totalNewOCs++;
                        newOCs.push(ocInfo);
                        
                        console.log(`  ✓ 新 OC: ${ocInfo.crimeName} (${ocInfo.difficulty}) - ${ocInfo.player}`);
                    }
                }
            }
            
            if (newOCs.length > 0) {
                console.log(`\n🎯 发现 ${newOCs.length} 个新 OC！`);
                
                // 发送通知
                await this.sendEmailNotification(newOCs);
                await this.sendWebhookNotification(newOCs);
                
                // 保存状态
                this.saveState();
            } else {
                console.log('  没有新的 OC');
            }
            
            console.log(`总计：已检查 ${this.checkCount} 次，发现 ${this.totalNewOCs} 个新 OC`);
            
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
        console.log('🚀 Torn OC Spawn 监控守护进程已启动');
        console.log('='.repeat(60));
        console.log(`检查间隔：${this.config.checkInterval} 秒`);
        console.log(`邮件通知：${this.config.email.enabled ? '✓ 启用' : '✗ 禁用'}`);
        console.log(`Webhook：${this.config.webhook.enabled ? '✓ 启用' : '✗ 禁用'}`);
        console.log(`过滤条件：难度 >= ${this.config.filters.minDifficulty}, Scope >= ${this.config.filters.minScope}`);
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
    // 加载配置
    const config = loadConfig();
    
    if (!config) {
        console.log('未找到配置，正在创建默认配置文件...');
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
        console.log(`\n请编辑 ${CONFIG_FILE} 文件，填入你的配置信息：`);
        console.log('1. tornApiKey: 你的 Torn API Key');
        console.log('2. email.auth: 你的邮箱账号和密码');
        console.log('3. email.to: 接收通知的邮箱地址');
        console.log('\n或者设置环境变量（推荐用于 Railway 部署）：');
        console.log('- TORN_API_KEY');
        console.log('- EMAIL_ENABLED=true');
        console.log('- EMAIL_SERVICE=gmail');
        console.log('- EMAIL_USER');
        console.log('- EMAIL_PASS');
        console.log('- EMAIL_TO');
        console.log('\n配置完成后重新运行此脚本。');
        process.exit(0);
    }
    
    // 验证配置
    if (!config.tornApiKey || config.tornApiKey === 'YOUR_API_KEY_HERE') {
        console.error('❌ 请配置 Torn API Key！');
        console.error('   环境变量：TORN_API_KEY');
        console.error('   或编辑 config.json 文件');
        process.exit(1);
    }
    
    // 创建并启动监控
    const monitor = new OCMonitor(config);
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

module.exports = OCMonitor;
