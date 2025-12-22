// ==UserScript==
// @name         Torn 公司申请监听工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  实时监听公司申请，有新申请时发送桌面通知
// @author       xiansakana[2754627]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #companyMonitorBtn {
            position: fixed;
            top: calc(50% + 180px);
            right: -25px;
            transform: translateY(-50%);
            width: 30px;
            height: 80px;
            border-radius: 8px 0 0 8px;
            background: #28a745;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            z-index: 9999;
            box-shadow: -2px 0 10px rgba(0,0,0,0.3);
            writing-mode: vertical-rl;
            text-orientation: mixed;
            transition: right 0.3s ease;
        }
        #companyMonitorBtn:hover { background: #218838; right: 0; }
        #companyMonitorBtn.panel-open { right: 0; }
        #companyMonitorBtn.monitoring { background: #ffc107; color: #333; }

        #companyMonitorModal {
            display: none;
            position: fixed;
            top: 50%;
            right: 35px;
            transform: translateY(-50%);
            z-index: 10000;
            max-height: 90vh;
            max-width: calc(100vw - 50px);
            overflow-y: auto;
        }
        #companyMonitorModal.show { display: block; }

        .cm-container {
            background: #333;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            max-width: 100%;
            color: #ccc;
            font-family: Arial, sans-serif;
            position: relative;
            box-shadow: -5px 0 20px rgba(0,0,0,0.5);
            box-sizing: border-box;
        }
        .cm-close {
            position: absolute;
            top: 10px; right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #888;
        }
        .cm-close:hover { color: #fff; }
        .cm-container h2 { color: #ccc; margin-top: 0; font-size: 18px; }
        .cm-input-group { margin-bottom: 15px; }
        .cm-input-group label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px; }
        .cm-input-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #2d2d2d;
            color: #ccc;
            font-size: 14px;
            box-sizing: border-box;
        }
        .cm-input-group input:focus {
            outline: none;
            border-color: #4da6ff;
        }
        .cm-input-group input:disabled { opacity: 0.6; }
        .cm-btn-group { display: flex; gap: 10px; }
        .cm-btn {
            flex: 1;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            border: none;
        }
        .cm-btn.start { background: #28a745; color: white; }
        .cm-btn.start:hover { background: #218838; }
        .cm-btn.stop { background: #dc3545; color: white; display: none; }
        .cm-btn.stop:hover { background: #c82333; }
        .cm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .cm-error { color: #ff6b6b; margin-top: 10px; font-size: 13px; }
        .cm-info { color: #ffc107; margin-top: 10px; font-size: 13px; }

        .cm-status {
            margin-top: 15px;
            padding: 12px;
            border-radius: 4px;
            background: #2d2d2d;
            border: 1px solid #444;
            display: none;
            font-size: 13px;
        }
        .cm-status.show { display: block; }
        .cm-status.monitoring { border-color: #28a745; background: #1e3a28; }
        .cm-status-text { font-weight: bold; margin-bottom: 8px; }
        .cm-status-text.active { color: #28a745; }
        .cm-status p { margin: 4px 0; color: #aaa; }
        .cm-status span { color: #4da6ff; }

        .cm-app-list { margin-top: 15px; }
        .cm-app-item {
            background: #2d2d2d;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 4px;
            border-left: 4px solid #28a745;
            animation: cmSlideIn 0.3s ease-out;
        }
        @keyframes cmSlideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .cm-app-item h4 { margin: 0 0 8px 0; color: #4da6ff; font-size: 14px; }
        .cm-app-item p { margin: 4px 0; color: #aaa; font-size: 12px; }

        @media (max-width: 500px) {
            .cm-container { width: calc(100vw - 50px); }
        }
    `);

    var btn = document.createElement('button');
    btn.id = 'companyMonitorBtn';
    btn.innerHTML = '公司';
    btn.title = '公司申请监听工具';
    document.body.appendChild(btn);

    var modal = document.createElement('div');
    modal.id = 'companyMonitorModal';
    modal.innerHTML = `
        <div class="cm-container">
            <span class="cm-close">&times;</span>
            <h2>公司申请监听工具</h2>
            <div class="cm-input-group">
                <label>API Key (FULL)</label>
                <input type="text" id="cmApiKey" placeholder="请输入你的Torn API Key" />
            </div>
            <div class="cm-input-group">
                <label>检查间隔（秒）</label>
                <input type="number" id="cmInterval" value="30" min="10" max="300" />
            </div>
            <div class="cm-btn-group">
                <button class="cm-btn start" id="cmStartBtn">开始监听</button>
                <button class="cm-btn stop" id="cmStopBtn">停止监听</button>
            </div>
            <div class="cm-error" id="cmError"></div>
            <div class="cm-info" id="cmInfo"></div>
            <div class="cm-status" id="cmStatus">
                <div class="cm-status-text" id="cmStatusText">监听中...</div>
                <p>下次检查：<span id="cmNextCheck">--</span></p>
                <p>已检查：<span id="cmCheckCount">0</span> 次</p>
                <p>发现申请：<span id="cmAppCount">0</span> 个</p>
            </div>
            <div class="cm-app-list" id="cmAppList"></div>
        </div>
    `;
    document.body.appendChild(modal);

    var apiKeyInput = document.getElementById('cmApiKey');
    var intervalInput = document.getElementById('cmInterval');
    var startBtn = document.getElementById('cmStartBtn');
    var stopBtn = document.getElementById('cmStopBtn');
    var errorEl = document.getElementById('cmError');
    var infoEl = document.getElementById('cmInfo');
    var statusEl = document.getElementById('cmStatus');
    var statusText = document.getElementById('cmStatusText');
    var nextCheckEl = document.getElementById('cmNextCheck');
    var checkCountEl = document.getElementById('cmCheckCount');
    var appCountEl = document.getElementById('cmAppCount');
    var appListEl = document.getElementById('cmAppList');

    var savedKey = localStorage.getItem('APIKey') || GM_getValue('tornApiKey', '');
    if (savedKey) apiKeyInput.value = savedKey;

    var isMonitoring = false;
    var monitorTimer = null;
    var checksPerformed = 0;
    var totalApplications = 0;
    var seenAppIds = new Set();

    btn.addEventListener('click', function() { 
        modal.classList.toggle('show'); 
        btn.classList.toggle('panel-open');
    });
    modal.querySelector('.cm-close').addEventListener('click', function() { 
        modal.classList.remove('show'); 
        btn.classList.remove('panel-open');
    });


    function sendNotification(title, body) {
        GM_notification({
            title: title,
            text: body,
            timeout: 10000,
            onclick: function() { window.focus(); }
        });
    }

    async function fetchCompanyApplications(apiKey) {
        var resp = await fetch('https://api.torn.com/company/?selections=applications&key=' + apiKey);
        var data = await resp.json();
        if (data.error) throw new Error(data.error.error || 'API返回错误');
        return data;
    }

    function renderApplication(app, appId) {
        var div = document.createElement('div');
        div.className = 'cm-app-item';
        var expiresTime = new Date(app.expires * 1000).toLocaleString('zh-CN');
        div.innerHTML = '<h4>新申请 - ID: ' + appId + '</h4>' +
            '<p>申请人：' + (app.name || '未知') + ' (ID: ' + (app.userID || '未知') + ')</p>' +
            '<p>等级：' + (app.level || '未知') + '</p>' +
            '<p>智力：' + (app.stats?.intelligence?.toLocaleString() || '未知') + '</p>' +
            '<p>耐力：' + (app.stats?.endurance?.toLocaleString() || '未知') + '</p>' +
            '<p>体力劳动：' + (app.stats?.manual_labor?.toLocaleString() || '未知') + '</p>' +
            '<p>状态：' + (app.status || '未知') + '</p>' +
            '<p>过期时间：' + expiresTime + '</p>' +
            '<p>消息：' + (app.message || '无消息') + '</p>';
        appListEl.insertBefore(div, appListEl.firstChild);
    }

    async function performCheck() {
        var apiKey = apiKeyInput.value.trim();
        if (!apiKey) { stopMonitoring(); errorEl.textContent = 'API Key不能为空'; return; }

        try {
            errorEl.textContent = '';
            checksPerformed++;
            checkCountEl.textContent = checksPerformed;

            var data = await fetchCompanyApplications(apiKey);

            if (data.applications && typeof data.applications === 'object') {
                var appIds = Object.keys(data.applications);
                var newApps = [];

                appIds.forEach(function(appId) {
                    if (!seenAppIds.has(appId)) {
                        seenAppIds.add(appId);
                        totalApplications++;
                        newApps.push({ id: appId, data: data.applications[appId] });
                    }
                });

                if (newApps.length > 0) {
                    appCountEl.textContent = totalApplications;
                    newApps.forEach(function(app) { renderApplication(app.data, app.id); });
                    sendNotification('Torn 公司新申请', '发现 ' + newApps.length + ' 个新的公司申请！');
                }
            }
        } catch (err) {
            errorEl.textContent = '检查失败：' + err.message;
        }
    }

    function updateNextCheckTime(seconds) {
        var nextTime = new Date(Date.now() + seconds * 1000);
        nextCheckEl.textContent = nextTime.toLocaleTimeString('zh-CN');
    }

    async function startMonitoring() {
        var apiKey = apiKeyInput.value.trim();
        var interval = parseInt(intervalInput.value) || 30;

        if (!apiKey) { errorEl.textContent = '请输入API Key！'; return; }
        if (interval < 10) { errorEl.textContent = '检查间隔不能小于10秒！'; return; }

        GM_setValue('tornApiKey', apiKey);
        isMonitoring = true;
        btn.classList.add('monitoring');
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        apiKeyInput.disabled = true;
        intervalInput.disabled = true;
        statusEl.classList.add('show', 'monitoring');
        statusText.classList.add('active');
        statusText.textContent = '监听中...';
        errorEl.textContent = '';
        infoEl.textContent = '';

        await performCheck();

        monitorTimer = setInterval(async function() {
            await performCheck();
            updateNextCheckTime(interval);
        }, interval * 1000);

        updateNextCheckTime(interval);
    }

    function stopMonitoring() {
        isMonitoring = false;
        btn.classList.remove('monitoring');
        if (monitorTimer) { clearInterval(monitorTimer); monitorTimer = null; }

        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        apiKeyInput.disabled = false;
        intervalInput.disabled = false;
        statusEl.classList.remove('monitoring');
        statusText.classList.remove('active');
        statusText.textContent = '已停止监听';
        nextCheckEl.textContent = '--';
    }

    startBtn.addEventListener('click', startMonitoring);
    stopBtn.addEventListener('click', stopMonitoring);

    window.addEventListener('beforeunload', function() {
        if (isMonitoring) stopMonitoring();
    });

})();
