#!/usr/bin/env node

/**
 * 测试邮件发送
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('='.repeat(60));
    console.log('测试公司监控邮件发送');
    console.log('='.repeat(60));
    
    const config = {
        service: process.env.EMAIL_SERVICE || 'qq',
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
    
    const configs = [];
    
    if (config.service === 'qq') {
        configs.push({
            name: 'QQ - SSL (465)',
            config: {
                host: 'smtp.qq.com',
                port: 465,
                secure: true,
                auth: { user: config.user, pass: config.pass },
                tls: { rejectUnauthorized: false }
            }
        });
    } else if (config.service === '163') {
        configs.push({
            name: '163 - SSL (465)',
            config: {
                host: 'smtp.163.com',
                port: 465,
                secure: true,
                auth: { user: config.user, pass: config.pass }
            }
        });
    } else {
        configs.push({
            name: 'Gmail - STARTTLS (587)',
            config: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: { user: config.user, pass: config.pass },
                tls: { ciphers: 'SSLv3', rejectUnauthorized: false }
            }
        });
    }
    
    for (const testConfig of configs) {
        console.log(`\n测试配置: ${testConfig.name}`);
        console.log('-'.repeat(60));
        
        try {
            const transporter = nodemailer.createTransport(testConfig.config);
            
            console.log('验证连接...');
            await transporter.verify();
            console.log('✓ 连接验证成功');
            
            console.log('发送测试邮件...');
            const info = await transporter.sendMail({
                from: config.from,
                to: config.to,
                subject: '🧪 Torn Company Monitor - 邮件测试',
                html: `
                    <h2>公司监控邮件测试成功！</h2>
                    <p>这是一封测试邮件，用于验证 Torn Company Monitor 的邮件通知功能。</p>
                    <p>配置: ${testConfig.name}</p>
                    <p>时间: ${new Date().toLocaleString('zh-CN')}</p>
                    <hr>
                    <h3>示例申请通知：</h3>
                    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
                        <tr style="background: #f0f0f0;">
                            <th>申请人</th><th>等级</th><th>智力</th><th>耐力</th><th>体力劳动</th>
                        </tr>
                        <tr>
                            <td><strong>TestUser</strong> (ID: 123456)</td>
                            <td>50</td>
                            <td>1,000,000</td>
                            <td>800,000</td>
                            <td>500,000</td>
                        </tr>
                    </table>
                `
            });
            
            console.log('✓ 邮件发送成功！');
            console.log(`  Message ID: ${info.messageId}`);
            console.log(`\n✅ 成功！使用配置: ${testConfig.name}`);
            process.exit(0);
            
        } catch (err) {
            console.error('❌ 失败:', err.message);
        }
    }
    
    console.log('\n❌ 所有配置都失败了');
    process.exit(1);
}

testEmail();
