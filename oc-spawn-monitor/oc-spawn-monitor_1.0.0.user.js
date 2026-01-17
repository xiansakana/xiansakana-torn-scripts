// ==UserScript==
// @name         Torn OC Spawn 监控工具
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  实时监控新的OC spawn并发送桌面通知，每分钟检查一次
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
        #ocMonitorBtn {
            position: fixed;
            top: calc(50% - 90px);
            right: -25px;
            transform: translateY(-50%);
            width: 30px;
            height: 80px;
            border-radius: 8px 0 0 8px;
            background: #6f42c1;
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
        #ocMonitorBtn:hover { background: #5a32a3; right: 0; }
        #ocMonitorBtn.panel-open { right: 0; }
        #ocMonitorBtn.monitoring { background: #ffc107; color: #333; }

        #ocMonitorModal {
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
        #ocMonitorModal.show { display: block; }

        .ocm-container {
            background: #333;
            padding: 20px;
            border-radius: 8px;
            width: 450px;
            max-width: 100%;
            color: #ccc;
            font-family: Arial, sans-serif;
            position: relative;
            box-shadow: -5px 0 20px rgba(0,0,0,0.5);
            box-sizing: border-box;
        }
        .ocm-close {
            position: absolute;
            top: 10px; right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #888;
        }
        .ocm-close:hover { color: #fff; }
        .ocm-container h2 { color: #ccc; margin-top: 0; font-size: 18px; }
        .ocm-input-group { margin-bottom: 15px; }
        .ocm-input-group label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px; }
        .ocm-input-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #2d2d2d;
            color: #ccc;
            font-size: 14px;
            box-sizing: border-box;
        }
        .ocm-input-group input:focus {
            outline: none;
            border-color: #4da6ff;
        }
        .ocm-input-group input:disabled { opacity: 0.6; }
        .ocm-btn-group { display: flex; gap: 10px; }
        .ocm-btn {
            flex: 1;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            border: none;
        }
        .ocm-btn.start { background: #dc3545; color: white; }
        .ocm-btn.start:hover { background: #c82333; }
        .ocm-btn.stop { background: #6c757d; color: white; display: none; }
        .ocm-btn.stop:hover { background: #5a6268; }
        .ocm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ocm-error { color: #ff6b6b; margin-top: 10px; font-size: 13px; }
        .ocm-info { color: #ffc107; margin-top: 10px; font-size: 13px; }

        .ocm-status {
            margin-top: 15px;
            padding: 12px;
            border-radius: 4px;
            background: #2d2d2d;
            border: 1px solid #444;
            display: none;
            font-size: 13px;
        }
        .ocm-status.show { display: block; }
        .ocm-status.monitoring { border-color: #dc3545; background: #3a1e1e; }
        .ocm-status-text { font-weight: bold; margin-bottom: 8px; }
        .ocm-status-text.active { color: #dc3545; }
        .ocm-status p { margin: 4px 0; color: #aaa; }
        .ocm-status span { color: #4da6ff; }

        .ocm-oc-list { margin-top: 15px; max-height: 400px; overflow-y: auto; }
        .ocm-oc-item {
            background: #2d2d2d;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 4px;
            border-left: 4px solid #dc3545;
            animation: ocmSlideIn 0.3s ease-out;
        }
        @keyframes ocmSlideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .ocm-oc-item h4 { margin: 0 0 8px 0; color: #dc3545; font-size: 14px; }
        .ocm-oc-item p { margin: 4px 0; color: #aaa; font-size: 12px; }
        .ocm-oc-item .ocm-ready { color: #28a745; font-weight: bold; }
        .ocm-oc-item .ocm-planning { color: #ffc107; font-weight: bold; }

        @media (max-width: 500px) {
            .ocm-container { width: calc(100vw - 50px); }
        }

        @media (max-width: 768px) {
            #ocMonitorBtn {
                right: -30px;
                transition: right 0.3s ease;
            }
            #ocMonitorBtn.btn-visible { right: 0; }
            #ocMonitorBtn:hover { right: -30px; }
            #ocMonitorBtn.btn-visible:hover { right: 0; }
        }
    `);

    var btn = document.createElement('button');
    btn.id = 'ocMonitorBtn';
    btn.innerHTML = 'OC';
    btn.title = 'OC Spawn 监控工具';
    document.body.appendChild(btn);

    var modal = document.createElement('div');
    modal.id = 'ocMonitorModal';
    modal.innerHTML = `
        <div class="ocm-container">
            <span class="ocm-close">&times;</span>
            <h2>OC Spawn 监控工具</h2>
            <div class="ocm-input-group">
                <label>API Key (FULL)</label>
                <input type="text" id="ocmApiKey" placeholder="请输入你的Torn API Key" />
            </div>
            <div class="ocm-input-group">
                <label>检查间隔（秒）</label>
                <input type="number" id="ocmInterval" value="60" min="30" max="300" />
            </div>
            <div class="ocm-btn-group">
                <button class="ocm-btn start" id="ocmStartBtn">开始监控</button>
                <button class="ocm-btn stop" id="ocmStopBtn">停止监控</button>
            </div>
            <div class="ocm-error" id="ocmError"></div>
            <div class="ocm-info" id="ocmInfo"></div>
            <div class="ocm-status" id="ocmStatus">
                <div class="ocm-status-text" id="ocmStatusText">监控中...</div>
                <p>下次检查：<span id="ocmNextCheck">--</span></p>
                <p>已检查：<span id="ocmCheckCount">0</span> 次</p>
                <p>发现新OC：<span id="ocmOcCount">0</span> 个</p>
            </div>
            <div class="ocm-oc-list" id="ocmOcList"></div>
        </div>
    `;
    document.body.appendChild(modal);

    var apiKeyInput = document.getElementById('ocmApiKey');
    var intervalInput = document.getElementById('ocmInterval');
    var startBtn = document.getElementById('ocmStartBtn');
    var stopBtn = document.getElementById('ocmStopBtn');
    var errorEl = document.getElementById('ocmError');
    var infoEl = document.getElementById('ocmInfo');
    var statusEl = document.getElementById('ocmStatus');
    var statusText = document.getElementById('ocmStatusText');
    var nextCheckEl = document.getElementById('ocmNextCheck');
    var checkCountEl = document.getElementById('ocmCheckCount');
    var ocCountEl = document.getElementById('ocmOcCount');
    var ocListEl = document.getElementById('ocmOcList');

    var savedKey = localStorage.getItem('APIKey') || GM_getValue('tornApiKey', '');
    if (savedKey) apiKeyInput.value = savedKey;

    var isMonitoring = false;
    var monitorTimer = null;
    var checksPerformed = 0;
    var totalNewOCs = 0;
    var seenOcIds = new Set();

    // 移动端滑动手势支持
    var touchStartX = 0;
    var touchStartY = 0;
    var swipeThreshold = 50;
    var edgeThreshold = 50;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        var touchEndX = e.changedTouches[0].screenX;
        var touchEndY = e.changedTouches[0].screenY;
        var diffX = touchEndX - touchStartX;
        var diffY = Math.abs(touchEndY - touchStartY);
        var screenWidth = window.innerWidth;

        if (Math.abs(diffX) > diffY && Math.abs(diffX) > swipeThreshold) {
            if (diffX < 0 && touchStartX > screenWidth - edgeThreshold) {
                btn.classList.add('btn-visible');
            } else if (diffX > 0 && btn.classList.contains('btn-visible') && !modal.classList.contains('show')) {
                btn.classList.remove('btn-visible');
            }
        }
    }, { passive: true });

    btn.addEventListener('click', function() { 
        modal.classList.toggle('show'); 
        btn.classList.toggle('panel-open');
    });
    modal.querySelector('.ocm-close').addEventListener('click', function() { 
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

    async function fetchFactionNews(apiKey) {
        var resp = await fetch('https://api.torn.com/v2/faction/news?striptags=true&limit=100&sort=DESC&cat=crime&key=' + apiKey);
        var data = await resp.json();
        if (data.error) throw new Error(data.error.error || 'API返回错误');
        return data.news || [];
    }

    function parseOCFromNews(newsItem) {
        // 匹配 "XXX used X scope spawning the XXX scenario YYY"
        var spawnMatch = newsItem.text.match(/(.+?) used (\d+) scope spawning the (\w+) scenario (.+?) \[view\]/);
        if (spawnMatch) {
            return {
                type: 'spawned',
                player: spawnMatch[1],
                scopeCount: spawnMatch[2],
                difficulty: spawnMatch[3],
                crimeName: spawnMatch[4],
                newsId: newsItem.id,
                timestamp: newsItem.timestamp,
                text: newsItem.text
            };
        }
        
        return null;
    }

    function renderOC(ocNews) {
        var div = document.createElement('div');
        div.className = 'ocm-oc-item';
        
        var timeStr = new Date(ocNews.timestamp * 1000).toLocaleString('zh-CN');
        
        var difficultyColor = {
            'simple': '#28a745',
            'intermediate': '#ffc107',
            'advanced': '#dc3545'
        }[ocNews.difficulty] || '#6c757d';
        
        div.innerHTML = '<h4>' + ocNews.crimeName + '</h4>' +
            '<p>难度：<span style="color:' + difficultyColor + '; font-weight:bold;">' + ocNews.difficulty + '</span> | Scope: ' + ocNews.scopeCount + '</p>' +
            '<p>发起人：' + ocNews.player + '</p>' +
            '<p>时间：' + timeStr + '</p>';
        
        ocListEl.appendChild(div);
    }

    async function performCheck() {
        var apiKey = apiKeyInput.value.trim();
        if (!apiKey) { stopMonitoring(); errorEl.textContent = 'API Key不能为空'; return; }

        try {
            errorEl.textContent = '';
            checksPerformed++;
            checkCountEl.textContent = checksPerformed;

            var newsList = await fetchFactionNews(apiKey);
            var newOCs = [];

            newsList.forEach(function(newsItem) {
                if (!seenOcIds.has(newsItem.id)) {
                    var ocInfo = parseOCFromNews(newsItem);
                    if (ocInfo) {
                        seenOcIds.add(newsItem.id);
                        totalNewOCs++;
                        newOCs.push(ocInfo);
                    }
                }
            });

            if (newOCs.length > 0) {
                ocCountEl.textContent = totalNewOCs;
                newOCs.forEach(function(oc) { renderOC(oc); });
                
                var notificationText = newOCs.map(function(oc) {
                    return oc.player + ' spawned ' + oc.difficulty + ' ' + oc.crimeName;
                }).join('\n');
                
                sendNotification('发现 ' + newOCs.length + ' 个新OC！', notificationText);
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
        var interval = parseInt(intervalInput.value) || 60;

        if (!apiKey) { errorEl.textContent = '请输入API Key！'; return; }
        if (interval < 30) { errorEl.textContent = '检查间隔不能小于30秒！'; return; }

        GM_setValue('tornApiKey', apiKey);
        isMonitoring = true;
        btn.classList.add('monitoring');
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        apiKeyInput.disabled = true;
        intervalInput.disabled = true;
        statusEl.classList.add('show', 'monitoring');
        statusText.classList.add('active');
        statusText.textContent = '监控中...';
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
        statusText.textContent = '已停止监控';
        nextCheckEl.textContent = '--';
    }

    startBtn.addEventListener('click', startMonitoring);
    stopBtn.addEventListener('click', stopMonitoring);

    window.addEventListener('beforeunload', function() {
        if (isMonitoring) stopMonitoring();
    });

})();
