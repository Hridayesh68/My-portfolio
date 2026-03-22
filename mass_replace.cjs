const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
    [/text-gray-900 dark:text-white/g, 'text-[var(--text)]'],
    [/text-gray-900 dark:text-gray-200/g, 'text-[var(--text)]'],
    [/text-gray-800 dark:text-white/g, 'text-[var(--text)]'],
    [/text-gray-700 dark:text-gray-300/g, 'text-[var(--text-muted)]'],
    [/text-gray-600 dark:text-gray-400/g, 'text-[var(--text-muted)]'],
    [/text-gray-600 dark:text-gray-300/g, 'text-[var(--text-muted)]'],
    [/text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary/g, 'text-[var(--text-muted)] hover:text-[var(--primary)]'],
    [/text-gray-500 dark:text-gray-400/g, 'text-[var(--text-muted)]'],
    [/text-gray-500 dark:text-gray-500/g, 'text-[var(--text-dim)]'],
    [/border-gray-200 dark:border-white\/10/g, 'border-[var(--border)]'],
    [/border-gray-100 dark:border-white\/5/g, 'border-[var(--border)]'],
    [/border-gray-100 dark:border-transparent/g, 'border-transparent'],
    [/bg-gray-200 dark:bg-\[var\(--bg-surface\)\]/g, 'bg-[var(--bg-surface)]'],
    [/bg-black\/5 dark:bg-black\/40/g, 'bg-black/40'],
    [/bg-black\/10 dark:bg-black\/50/g, 'bg-black/50'],
    [/bg-white dark:bg-white/g, 'bg-transparent'],
    [/bg-gray-100 dark:bg-white\/10/g, 'bg-[var(--bg-surface)]'],
    [/bg-gray-50 dark:bg-white\/5/g, 'bg-[var(--bg-elevated)]'],
    [/filter dark:brightness-110/g, 'filter brightness-110'],
    [/bg-gray-100 dark:bg-\[var\(--bg-surface\)\]/g, 'bg-[var(--bg-surface)]'],
    [/bg-white\/50 dark:bg-\[var\(--bg-surface\)\]\/50/g, 'bg-[var(--bg-surface)]/50'],
    [/bg-gray-50 hover:bg-gray-100 dark:bg-white\/5 dark:hover:bg-white\/10/g, 'bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)]'],
    [/border border-[#ffffff10]/g, 'border border-[var(--border)]']
];

function walkSync(dir, filelist = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            filelist.push(filepath);
        }
    }
    return filelist;
}

const files = walkSync(srcDir);
let modifiedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    for (const [regex, replacement] of replacements) {
        if (regex.test(content)) {
            content = content.replace(regex, replacement);
            modified = true;
        }
    }
    
    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Updated ${file}`);
    }
}

console.log(`\nCompleted. Modified ${modifiedCount} files.`);
