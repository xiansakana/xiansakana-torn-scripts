// ==UserScript==
// @name         Torn 快速链接导航
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在 Torn 页面添加快速跳转链接菜单
// @author       xiansakana[2754627]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const links = [
        { text: '公司', href: '/companies.php' },
        { text: '股票', href: 'https://tornsy.com/' },
        { text: '赛车', href: '/loader.php?sid=racing' },
        { text: '偏好', href: '/preferences.php#tab=attack-preferences' },
        { text: '飞行', href: '/travelagency.php' },
        { text: '帮提', href: '/bounties.php' },
        { text: '市场', href: '/page.php?sid=ItemMarket' },
        { text: '点市', href: '/pmarket.php' },
        { text: '股市', href: '/page.php?sid=stocks' },
        { text: '巴扎', href: '/bazaar.php' },
        { text: '存钱', href: '/factions.php?step=your#/tab=armoury&start=0&sub=donate' },
        { text: '取钱', href: '/factions.php?step=your#/tab=controls' },
        { text: '交易', href: '/trade.php' },
        { text: '监狱', href: '/jailview.php' },
        { text: '物品', href: '/item.php' },
        { text: '任务', href: '/loader.php?sid=missions' },
        { text: '帮派', href: '/factions.php?step=your#/war/chain' },
        { text: 'PI', href: '/properties.php#/p=options&ID=4752046&tab=vault' },
        { text: '健身', href: '/gym.php' },
        { text: '犯罪', href: '/crimes.php' },
        { text: '医院', href: '/hospitalview.php' },
        { text: 'RR', href: '/page.php?sid=russianRoulette#/' },
        { text: '微尘', href: 'https://fce295ndf.lightyy.com/#/' },
        { text: '数据', href: '/personalstats.php?ID=2754627&stats=useractivity&from=1%20month' },
        { text: 'Slots', href: '/page.php?sid=slots' },
        { text: '拍卖', href: '/amarket.php#tab=extremely&start=0' }
    ];

    const style = `
        #quickLinkPanel {
            position: fixed;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            z-index: 9999;
            font-family: Arial, sans-serif;
            color: #fff;
            text-align: center;
            padding: 10px;
        }
        #quickLinkToggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: none;
            background: #007bff;
            color: #fff;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.35);
            transition: transform 0.2s ease, background 0.2s ease;
        }
        #quickLinkToggle:hover {
            transform: scale(1.05);
            background: #0062cc;
        }
        #quickLinkMenu {
            display: none;
            margin-top: 10px;
            padding: 10px 12px;
            width: 180px;
            border-radius: 12px;
            background: rgba(20, 20, 20, 0.95);
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            text-align: left;
            max-height: 70vh;
            overflow-y: auto;
        }
        #quickLinkMenu.show {
            display: block;
        }
        #quickLinkMenu a {
            display: block;
            color: #f1f1f1;
            text-decoration: none;
            padding: 8px 10px;
            border-radius: 6px;
            margin-bottom: 6px;
            transition: background 0.2s ease;
            word-break: break-word;
        }
        #quickLinkMenu a:hover {
            background: rgba(255,255,255,0.08);
        }
        #quickLinkMenu a:last-child {
            margin-bottom: 0;
        }

        @media (max-width: 640px) {
            #quickLinkPanel {
                top: auto;
                bottom: 0;
                left: 0;
                right: 0;
                transform: none;
                width: 100%;
                padding: 8px;
                box-sizing: border-box;
            }
            #quickLinkToggle {
                width: 40px;
                height: 40px;
            }
            #quickLinkMenu {
                display: block;
                margin-top: 8px;
                width: calc(100% - 16px);
                max-height: 40vh;
                padding: 10px;
                border-radius: 0;
            }
            #quickLinkMenu a {
                padding: 10px 12px;
                font-size: 14px;
            }
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.head.appendChild(styleEl);

    const panel = document.createElement('div');
    panel.id = 'quickLinkPanel';

    const toggle = document.createElement('button');
    toggle.id = 'quickLinkToggle';
    toggle.type = 'button';
    toggle.title = '快速链接';
    toggle.textContent = '⇨';
    panel.appendChild(toggle);

    const menu = document.createElement('div');
    menu.id = 'quickLinkMenu';
    menu.classList.add('show');

    links.forEach(link => {
        const anchor = document.createElement('a');
        anchor.textContent = link.text;
        anchor.href = link.href;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        menu.appendChild(anchor);
    });

    panel.appendChild(menu);
    document.body.appendChild(panel);

    toggle.addEventListener('click', () => {
        menu.classList.toggle('show');
    });

    document.addEventListener('click', event => {
        if (!panel.contains(event.target)) {
            menu.classList.remove('show');
        }
    });
})();
