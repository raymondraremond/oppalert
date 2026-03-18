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
    
    // Replace text classes
    content = content.replace(/text-white/g, 'text-primary');
    content = content.replace(/text-muted-dark/g, 'text-muted');
    
    // Replace bg classes
    content = content.replace(/bg-white\/\[0\.03\]/g, 'bg-[var(--input-bg)]');
    content = content.replace(/bg-white\/5/g, 'bg-[var(--icon-bg)]');
    content = content.replace(/bg-white\/\[0\.02\]/g, 'bg-[var(--icon-bg)]');
    
    // Replace border classes
    content = content.replace(/border-white\/10/g, 'border-[var(--glass-border)]');
    content = content.replace(/border-white\/5/g, 'border-[var(--border)]');
    
    // Decoration
    content = content.replace(/decoration-white\/20/g, 'decoration-primary/20');
    
    if (content !== old) {
       fs.writeFileSync(file, content);
       console.log('Updated ' + file);
    }
});
