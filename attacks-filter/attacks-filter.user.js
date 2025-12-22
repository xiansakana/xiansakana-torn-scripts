// ==UserScript==
// @name         Torn 攻击数据筛选工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  筛选攻击数据，支持按派系、Warlord Bonus和时间范围过滤
// @author       xiansakana[2754627]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #attackFilterBtn {
            position: fixed;
            top: calc(50% + 90px);
            right: -25px;
            transform: translateY(-50%);
            width: 30px;
            height: 80px;
            border-radius: 8px 0 0 8px;
            background: #dc3545;
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
        #attackFilterBtn:hover { background: #c82333; right: 0; }
        #attackFilterBtn.panel-open { right: 0; }

        #attackFilterModal {
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
        #attackFilterModal.show { display: block; }

        .af-container {
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
        .af-close {
            position: absolute;
            top: 10px; right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #888;
        }
        .af-close:hover { color: #fff; }
        .af-container h2 { color: #ccc; margin-top: 0; font-size: 18px; }
        .af-input-group { margin-bottom: 15px; }
        .af-input-group label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px; }
        .af-input-group input, .af-input-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #2d2d2d;
            color: #ccc;
            font-size: 14px;
            box-sizing: border-box;
        }
        .af-input-group input:focus, .af-input-group select:focus {
            outline: none;
            border-color: #4da6ff;
        }
        .af-input-group input[type="datetime-local"] { color-scheme: dark; }
        .af-time-group { display: flex; gap: 10px; }
        .af-time-group .af-input-group { flex: 1; min-width: 0; }
        .af-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            width: 100%;
        }
        .af-btn:hover { background: #0056b3; }
        .af-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .af-error { color: #ff6b6b; margin-top: 10px; font-size: 13px; }
        .af-info { color: #ffc107; margin-top: 10px; font-size: 13px; }

        .af-result { margin-top: 20px; display: none; }
        .af-result.show { display: block; }
        .af-stats {
            background: #2d2d2d;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 14px;
        }
        .af-stats span { color: #4da6ff; font-weight: bold; }
        .af-attack-item {
            background: #2d2d2d;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 4px;
            border-left: 4px solid #dc3545;
        }
        .af-attack-item h4 { margin: 0 0 8px 0; color: #4da6ff; font-size: 14px; }
        .af-attack-item p { margin: 4px 0; color: #aaa; font-size: 12px; line-height: 1.5; }

        @media (max-width: 500px) {
            .af-container { width: calc(100vw - 50px); }
            .af-time-group { flex-direction: column; gap: 0; }
        }
    `);

    var btn = document.createElement('button');
    btn.id = 'attackFilterBtn';
    btn.innerHTML = '攻击';
    btn.title = '攻击数据筛选工具';
    document.body.appendChild(btn);

    var modal = document.createElement('div');
    modal.id = 'attackFilterModal';
    modal.innerHTML = `
        <div class="af-container">
            <span class="af-close">&times;</span>
            <h2>攻击数据筛选工具</h2>
            <div class="af-input-group">
                <label>API Key (FULL)</label>
                <input type="text" id="afApiKey" placeholder="请输入你的Torn API Key" />
            </div>
            <div class="af-input-group">
                <label>过滤器类型</label>
                <select id="afFilterType">
                    <option value="outgoing">Outgoing（发出的攻击）</option>
                    <option value="incoming">Incoming（收到的攻击）</option>
                </select>
            </div>
            <div class="af-input-group">
                <label>目标 Defender Faction ID</label>
                <input type="number" id="afDefenderFaction" placeholder="例如：8076" />
            </div>
            <div class="af-input-group">
                <label>Warlord Bonus 目标值（可选）</label>
                <input type="number" step="0.01" id="afWarlordBonus" placeholder="例如：1.39" />
            </div>
            <div class="af-time-group">
                <div class="af-input-group">
                    <label>开始时间</label>
                    <input type="datetime-local" id="afStartTime" />
                </div>
                <div class="af-input-group">
                    <label>结束时间</label>
                    <input type="datetime-local" id="afEndTime" />
                </div>
            </div>
            <button class="af-btn" id="afQueryBtn">查询并筛选</button>
            <div class="af-error" id="afError"></div>
            <div class="af-info" id="afInfo"></div>
            <div class="af-result" id="afResult">
                <div class="af-stats">符合条件的条目总数：<span id="afTotalCount">0</span></div>
                <div id="afAttackList"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    var apiKeyInput = document.getElementById('afApiKey');
    var filterTypeInput = document.getElementById('afFilterType');
    var defenderFactionInput = document.getElementById('afDefenderFaction');
    var warlordBonusInput = document.getElementById('afWarlordBonus');
    var startTimeInput = document.getElementById('afStartTime');
    var endTimeInput = document.getElementById('afEndTime');
    var queryBtn = document.getElementById('afQueryBtn');
    var errorEl = document.getElementById('afError');
    var infoEl = document.getElementById('afInfo');
    var resultEl = document.getElementById('afResult');
    var totalCountEl = document.getElementById('afTotalCount');
    var attackListEl = document.getElementById('afAttackList');

    var savedKey = localStorage.getItem('APIKey') || GM_getValue('tornApiKey', '');
    if (savedKey) apiKeyInput.value = savedKey;

    btn.addEventListener('click', function() { 
        modal.classList.toggle('show'); 
        btn.classList.toggle('panel-open');
    });
    modal.querySelector('.af-close').addEventListener('click', function() { 
        modal.classList.remove('show'); 
        btn.classList.remove('panel-open');
    });

    function toTimestamp(s) { return s ? Math.floor(new Date(s).getTime() / 1000) : null; }
    function formatTime(ts) { return new Date(ts * 1000).toLocaleString('zh-CN'); }


    async function fetchAttacksPage(apiKey, filters, limit, sort, from, to) {
        var params = new URLSearchParams();
        filters.forEach(function(f) { params.append('filters', f); });
        params.append('limit', limit.toString());
        params.append('sort', sort);
        if (from) params.append('from', from.toString());
        if (to) params.append('to', to.toString());
        params.append('key', apiKey);

        var resp = await fetch('https://api.torn.com/v2/user/attacks?' + params.toString());
        var data = await resp.json();
        if (data.error) throw new Error(data.error.error);
        return data;
    }

    async function fetchAllAttacks(apiKey, filters, sort, from, to) {
        var limit = 100, allAttacks = [], hasMore = true, pageCount = 0;
        while (hasMore && pageCount < 1000) {
            pageCount++;
            var data = await fetchAttacksPage(apiKey, filters, limit, sort, from, to);
            if (data.attacks && data.attacks.length > 0) {
                allAttacks = allAttacks.concat(data.attacks);
                if (data.attacks.length < limit) {
                    hasMore = false;
                } else {
                    var lastAttack = data.attacks[data.attacks.length - 1];
                    var newTo = lastAttack.started - 1;
                    if (newTo <= from) hasMore = false;
                    else to = newTo;
                }
            } else {
                hasMore = false;
            }
            if (hasMore) await new Promise(function(r) { setTimeout(r, 100); });
        }
        var uniqueAttacks = [], seenIds = new Set();
        allAttacks.forEach(function(attack) {
            if (!seenIds.has(attack.id)) {
                seenIds.add(attack.id);
                uniqueAttacks.push(attack);
            }
        });
        return uniqueAttacks;
    }

    function filterAttacks(attacks, params) {
        return attacks.filter(function(attack) {
            if (attack.defender?.faction?.id !== params.defenderFaction) return false;
            if (attack.ended < params.startTs || attack.ended > params.endTs) return false;
            if (params.warlordBonus !== null && attack.modifiers?.warlord !== params.warlordBonus) return false;
            return true;
        });
    }

    function renderResults(attacks) {
        totalCountEl.textContent = attacks.length;
        attackListEl.innerHTML = '';
        if (attacks.length === 0) {
            attackListEl.innerHTML = '<p style="color:#aaa;">暂无符合条件的条目</p>';
            return;
        }
        attacks.forEach(function(attack) {
            var div = document.createElement('div');
            div.className = 'af-attack-item';
            div.innerHTML = '<h4>攻击ID：' + attack.id + '</h4>' +
                '<div>' +
                '<p>攻击者：' + (attack.attacker?.name || '未知') + '（ID：' + (attack.attacker?.id || '未知') +
                '，派系：' + (attack.attacker?.faction?.name || '未知') + ' [' + (attack.attacker?.faction?.id || '未知') + ']）</p>' +
                '<p>防御者：' + (attack.defender?.name || '未知') + '（ID：' + (attack.defender?.id || '未知') +
                '，派系：' + (attack.defender?.faction?.name || '未知') + ' [' + (attack.defender?.faction?.id || '未知') + ']）</p>' +
                '<p>开始：' + formatTime(attack.started) + ' | 结束：' + formatTime(attack.ended) + '</p>' +
                '<p>结果：' + (attack.result || '未知') + ' | Respect +' + (attack.respect_gain || 0) + ' / -' + (attack.respect_loss || 0) + '</p>' +
                '<p>Chain：' + (attack.chain || 0) + ' | Warlord：' + (attack.modifiers?.warlord || '无') + '</p>' +
                '<p>Ranked War：' + (attack.is_ranked_war ? '是' : '否') + ' | Raid：' + (attack.is_raid ? '是' : '否') + ' | Stealthed：' + (attack.is_stealthed ? '是' : '否') + '</p>' +
                '</div>';
            attackListEl.appendChild(div);
        });
    }

    queryBtn.addEventListener('click', async function() {
        errorEl.textContent = '';
        infoEl.textContent = '';
        resultEl.classList.remove('show');

        var apiKey = apiKeyInput.value.trim();
        var defenderFaction = parseInt(defenderFactionInput.value.trim());
        var warlordBonus = warlordBonusInput.value.trim() ? parseFloat(warlordBonusInput.value) : null;
        var startStr = startTimeInput.value;
        var endStr = endTimeInput.value;

        if (!apiKey) { errorEl.textContent = '请输入API Key！'; return; }
        if (isNaN(defenderFaction)) { errorEl.textContent = '请输入有效的Defender Faction ID！'; return; }
        if (!startStr || !endStr) { errorEl.textContent = '请选择完整的时间范围！'; return; }

        var startTs = toTimestamp(startStr), endTs = toTimestamp(endStr);
        if (startTs >= endTs) { errorEl.textContent = '开始时间不能晚于结束时间！'; return; }

        GM_setValue('tornApiKey', apiKey);
        queryBtn.disabled = true;
        queryBtn.textContent = '查询中...';

        try {
            infoEl.textContent = '正在获取数据...';
            var allAttacks = await fetchAllAttacks(apiKey, [filterTypeInput.value], 'DESC', startTs, endTs);

            if (!allAttacks || allAttacks.length === 0) {
                errorEl.textContent = '未获取到任何攻击数据';
                infoEl.textContent = '';
            } else {
                infoEl.textContent = '已获取 ' + allAttacks.length + ' 条数据，正在筛选...';
                var filtered = filterAttacks(allAttacks, { defenderFaction: defenderFaction, warlordBonus: warlordBonus, startTs: startTs, endTs: endTs });
                infoEl.textContent = '';
                resultEl.classList.add('show');
                renderResults(filtered);
            }
        } catch (err) {
            errorEl.textContent = '错误：' + err.message;
        } finally {
            queryBtn.disabled = false;
            queryBtn.textContent = '查询并筛选';
        }
    });

})();
