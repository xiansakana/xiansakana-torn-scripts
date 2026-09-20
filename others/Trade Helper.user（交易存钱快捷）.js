// ==UserScript==
// @name         Trade Helper
// @namespace    TornExtensions
// @version      1.0
// @description  GT小助手 快速存取
// @author       Luochen [2956255]
// @match        https://www.torn.com/trade.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // avoid over loading in pda
    try {
        const __win = window.unsafeWindow || window;
        if (__win.TradeHelper) return;
        __win.TradeHelper = true;
        window = __win; // fix unsafeWindow
    } catch (err) {
        console.log(err);
    }

    function mlog(s) {
        console.log(`[Trade Helper] ${s}`)
    }

    const $ = window.jQuery;


    let refreshUI = (members) => {
        mlog(`开始刷新UI`)

        const $moneyInput = $('div.input-money-group>input.input-money[type="text"]')
        const $inputArea = $('form[method="post"]>ul.inputs')

        const quickPlusSub = `
          <style>
            #TH_quickPlusSub \{ margin: 20px 0 0 77px; \}
            #TH_quickPlusSub>span \{ opacity:0.8;color:#ffffff;background-color:#DAA520;padding:3px;text-shadow:none;border-radius:5px;margin-right:3px;cursor: pointer; \}
            #TH_quickPlusSub>span:hover \{ opacity:1; \}

            @media screen and (max-width: 784px) \{
              #TH_quickPlusSub \{ margin: 20px 0 0 0; \}
            \}
          </style>
          <div id='TH_quickPlusSub'>
            <span data-money="all"><b>ALL</b></span>
            <span data-money="1/2"><b>1/2</b></span>
            <span data-money="2/3"><b>1/3</b></span>
            <span data-money="3/4"><b>1/4</b></span>
            <span data-money="4/5"><b>1/5</b></span>
            <!--<span data-money="0"><b>CLEAR</b></span>-->
            <span data-sub="10000000"><b>-10m</b></span>
            <span data-sub="20000000"><b>-20m</b></span>
            <span data-sub="50000000"><b>-50m</b></span>
            <span data-sub="100000000"><b>-100m</b></span>
          </div>
    `;
        const $quickPlusSub = $(quickPlusSub);
        $inputArea.before($quickPlusSub);
        $quickPlusSub.find('span[data-money]').on('click', (e) => {
            $moneyInput.val(e.currentTarget.dataset.money);
            dispatchEvt();
        })
        $quickPlusSub.find('span[data-sub]').on('click', (e) => {
            let money = formatMoney($moneyInput.val()) - formatMoney(e.currentTarget.dataset.sub);
            $moneyInput.val(money < 0 ? 0 : money);
            dispatchEvt();
        })

        const $btnArea = $('form[method="post"]>span.btn-wrap')

        const quickBtns = `
          <span id="TH_DepositAll" class="btn-wrap silver">
            <span class="btn">
              <input type="submit" value="Deposit All" class="torn-btn">
            </span>
          </span>
          <span id="TH_WithdrawAll" class="btn-wrap silver">
            <span class="btn">
              <input type="submit" value="Withdraw All" class="torn-btn">
            </span>
          </span>
    `;

        const $quickBtns = $(quickBtns);
        $btnArea.after($quickBtns);
        $quickBtns.filter('#TH_DepositAll').find('input[type="submit"]').on('click', (e) => {
            $moneyInput.val('all');
            dispatchEvt();
        })
        $quickBtns.filter('#TH_WithdrawAll').find('input[type="submit"]').on('click', (e) => {
            $moneyInput.val(0);
            dispatchEvt();
        })

        initFlag = true;

        let dispatchEvt = () => {
            var evtObj = document.createEvent('HTMLEvents');
            evtObj.initEvent('input');
            $moneyInput[0].dispatchEvent(evtObj);
        }

        let formatMoney = (money) => {
            return Number(money.replace(/\$|,/g, ''));
        }
    }

    let initFlag = false;
    let init = (force) => {
        if (!force && initFlag) return;
        let params = new URLSearchParams(window.location.hash.slice(1));
        let step = params.get('step');
        if (step !== 'addmoney') return;

        refreshUI();
    }

    let observerConfig = { childList: true, subtree: true };
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            if (mutationRecord.type === 'childList' && [...mutationRecord.addedNodes.values()].indexOf($('div.init-trade.add-money')[0]) !== -1){
                init(true);
                observer.disconnect();
            }
        });
    });

    window.onhashchange = (e) => {
        let params = new URLSearchParams(window.location.hash.slice(1));
        let step = params.get('step');
        if (step !== 'addmoney'){
            observer.disconnect();
            return;
        }

        let $tradeContainer = $('#trade-container')[0];
        observer.observe($tradeContainer, observerConfig);
    }

    window.onload = (e) => {
        let t = setInterval(() => {
            if ($('div.input-money-group>input.input-money[type="text"]').length > 0) {
                init();
                clearInterval(t);
            }
        }, 50)
    }

    //refreshUI();

})();