#!/usr/bin/env python3
import json
import secrets
from pathlib import Path

ROOT = Path('/opt/xiansakana-torn-scripts')
torn_cfg_path = ROOT / 'torn-toolbox-desktop/config.json'
portal_cfg_path = ROOT / 'portal/config.json'
example_path = ROOT / 'portal/config.ecs.example.json'

torn_cfg = json.loads(torn_cfg_path.read_text(encoding='utf-8'))
admin_token = torn_cfg.get('server', {}).get('adminToken', '')

if torn_cfg.get('server', {}).get('host') != '127.0.0.1':
    torn_cfg.setdefault('server', {})['host'] = '127.0.0.1'
    torn_cfg['server']['openBrowser'] = False
    torn_cfg_path.write_text(json.dumps(torn_cfg, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print('updated torn-toolbox host -> 127.0.0.1')

portal = json.loads(example_path.read_text(encoding='utf-8'))
portal['auth']['username'] = 'admin'
portal['auth']['password'] = admin_token or 'Kimiga1bansuki'
portal['auth']['sessionSecret'] = secrets.token_hex(24)

for svc in portal.get('services', []):
    if svc.get('id') == 'torn-toolbox':
        svc['adminToken'] = admin_token
    if svc.get('id') == 'napcat-webui':
        svc['url'] = 'http://123.56.235.12:6099/webui?token=ea711c964c58'

portal_cfg_path.write_text(json.dumps(portal, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print('portal config written')
print('login user:', portal['auth']['username'])
print('login pass:', portal['auth']['password'])
