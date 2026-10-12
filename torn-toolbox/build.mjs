import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(dir, 'Torn 工具箱-v1.6.32.user.js');
const start = '    // BEGIN TOOLBOX ITEM MODULES';
const end = '    // END TOOLBOX ITEM MODULES';
let script = fs.readFileSync(target, 'utf8');
const block = start + '\n' + ['quick-items.js', 'toolbox-theme.js'].map(file => fs.readFileSync(path.join(dir, 'modules', file), 'utf8')).join('\n') + '\n' + end;
const first = script.indexOf(start);
if (first >= 0) {
    const last = script.indexOf(end, first);
    if (last < 0) throw new Error('Missing item module end marker');
    script = script.slice(0, first) + block + script.slice(last + end.length);
} else {
    const last = script.lastIndexOf('})();');
    if (last < 0) throw new Error('Missing toolbox closure');
    script = script.slice(0, last) + block + '\n' + script.slice(last);
}
fs.writeFileSync(target, script, 'utf8');
console.log('Built standalone toolbox userscript (1.6.32).');
