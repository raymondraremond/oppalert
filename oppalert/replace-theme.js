const fs = require('fs');
const path = require('path');

const dirs = ['./app', './components'];
const walk = (d) => {
    let files = [];
    if (!fs.existsSync(d)) return files;
    fs.readdirSync(d).forEach(f => {
        let p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) files.push(...walk(p));
        else if (p.endsWith('.tsx') || p.endsWith('.ts')) files.push(p);
    });
    return files;
};

let allFiles = [];
dirs.forEach(d => allFiles.push(...walk(d)));

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let old = content;
    
    // Replace hardcoded dark theme text colors with CSS variables
    content = content.replace(/text-\[\#EDE8DF\]/g, 'text-primary');
    content = content.replace(/text-\[\#9A9C8E\]/g, 'text-muted');
    content = content.replace(/text-\[\#555C50\]/g, 'text-subtle');
    
    // Replace hardcoded dark theme background colors with CSS variables
    content = content.replace(/bg-\[\#080A07\]/g, 'bg-bg');
    content = content.replace(/bg-\[\#141710\]/g, 'bg-bg2');
    content = content.replace(/bg-\[\#222820\]/g, 'bg-surface');
    content = content.replace(/bg-\[\#1C2119\]/g, 'bg-icon-bg');
    
    // Specific hover states
    content = content.replace(/hover:bg-\[\#1A1F16\]/g, 'hover:bg-surface');
    content = content.replace(/hover:bg-\[\#222820\]/g, 'hover:bg-surface2');
    
    // Replace hardcoded dark theme border colors
    content = content.replace(/border-\[\#252D22\]/g, 'border-border');
    content = content.replace(/border-\[\#313D2C\]/g, 'border-border2');
    
    // Text inside quotes (for inline style objects where applicable, though less common in tailwind)
    content = content.replace(/'#080A07'/g, 'var(--bg)');
    content = content.replace(/'#141710'/g, 'var(--bg2)');
    content = content.replace(/'#EDE8DF'/g, 'var(--primary)');
    content = content.replace(/'#9A9C8E'/g, 'var(--muted)');
    content = content.replace(/'#252D22'/g, 'var(--border)');

    if (content !== old) {
       fs.writeFileSync(file, content);
       console.log('Updated ' + file);
    }
});
