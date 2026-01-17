#!/usr/bin/env node

/**
 * 测试邮件发送
 * 用于调试邮件配置问题
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('='.repeat(60));
    console.log('测试邮件发送');
    console.log('='.repeat(60));
    
    const config = {
        service: process.env.EMAIL_SERVICE || 'gmail',
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        to: process.env.EMAIL_TO,
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER
    };
    
    console.log('配置信息：');
    console.log(`  服务: ${config.service}`);
    console.log(`  发件人: ${config.user}`);
    console.log(`  收件人: ${config.to}`);
    console.log(`  密码长度: ${config.pass ? config.pass.length : 0} 字符`);
    console.log('');
    
    // 尝试不同的配置
    const configs = [];
    
    if (config.service === 'qq') {
        configs.push(
            {
                name: 'QQ - SSL (465) - 标准',
                config: {
                    host: 'smtp.qq.com',
                    port: 465,
                    secure: true,
                    auth: { user: config.user, pass: config.pass },
                    tls: {
                        rejectUnauthorized: false
                    }
                }
            },
            {
                name: 'QQ - SSL (465) - 兼容模式',
                config: {
                    host: 'smtp.qq.com',
                    port: 465,
                    secure: true,
                    auth: { user: config.user, pass: config.pass },
                    tls: {
                        rejectUnauthorized: false,
                        minVersion: 'TLSv1'
                    },
                    connectionTimeout: 10000,
                    greetingTimeout: 10000,
                    socketTimeout: 10000
                }
            },
            {
                name: 'QQ - STARTTLS (587)',
                config: {
                    host: 'smtp.qq.com',
                    port: 587,
                    secure: false,
                    auth: { user: config.user, pass: config.pass },
                    tls: {
                        rejectUnauthorized: false
                    }
                }
            },
            {
                name: 'QQ - Service',
                config: {
                    service: 'qq',
                    auth: { user: config.user, pass: config.pass }
                }
            }
        );
    } else if (config.service === '163') {
        configs.push(
            {
                name: '163 - SSL (465)',
                config: {
                    host: 'smtp.163.com',
                    port: 465,
                    secure: true,
                    auth: { user: config.user, pass: config.pass }
                }
            }
        );
    } else {
        // Gmail
        configs.push(
            {
                name: 'Gmail - STARTTLS (587)',
                config: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: { user: config.user, pass: config.pass },
                    tls: { ciphers: 'SSLv3', rejectUnauthorized: false }
                }
            },
            {
                name: 'Gmail - SSL (465)',
                config: {
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: { user: config.user, pass: config.pass },
                    tls: { rejectUnauthorized: false }
                }
            },
            {
                name: 'Gmail - Service',
                config: {
                    service: 'gmail',
                    auth: { user: config.user, pass: config.pass }
                }
            }
        );
    }
    
    for (const testConfig of configs) {
        console.log(`\n测试配置: ${testConfig.name}`);
        console.log('-'.repeat(60));
        
        try {
            const transporter = nodemailer.createTransport(testConfig.config);
            
            // 验证连接
            console.log('验证连接...');
            await transporter.verify();
            console.log('✓ 连接验证成功');
            
            // 发送测试邮件
            console.log('发送测试邮件...');
            const info = await transporter.sendMail({
                from: config.from,
                to: config.to,
                subject: '🧪 Torn OC Monitor - 邮件测试',
                html: `
                    <h2>邮件测试成功！</h2>
                    <p>这是一封测试邮件，用于验证 Torn OC Monitor 的邮件通知功能。</p>
                    <p>配置: ${testConfig.name}</p>
                    <p>时间: ${new Date().toLocaleString('zh-CN')}</p>
                `
            });
            
            console.log('✓ 邮件发送成功！');
            console.log(`  Message ID: ${info.messageId}`);
            console.log(`\n✅ 成功！使用配置: ${testConfig.name}`);
            process.exit(0);
            
        } catch (err) {
            console.error('❌ 失败:', err.message);
            if (err.code) console.error('   错误代码:', err.code);
            if (err.command) console.error('   命令:', err.command);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('❌ 所有配置都失败了');
    console.log('='.repeat(60));
    console.log('\n可能的原因：');
    console.log('1. Gmail 应用专用密码不正确');
    console.log('   - 确保已开启两步验证');
    console.log('   - 在 https://myaccount.google.com/apppasswords 生成新密码');
    console.log('   - 密码应该是 16 位，无空格');
    console.log('');
    console.log('2. Gmail 账号安全设置');
    console.log('   - 检查 https://myaccount.google.com/security');
    console.log('   - 确保"不够安全的应用的访问权限"已关闭（使用应用专用密码）');
    console.log('');
    console.log('3. 网络问题');
    console.log('   - 防火墙可能阻止了 SMTP 连接');
    console.log('   - 尝试使用 VPN');
    console.log('');
    console.log('4. 建议尝试其他邮箱服务：');
    console.log('   - QQ 邮箱: smtp.qq.com');
    console.log('   - 163 邮箱: smtp.163.com');
    console.log('   - Outlook: smtp-mail.outlook.com');
    
    process.exit(1);
}

testEmail();
