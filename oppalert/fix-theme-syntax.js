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
    
    // Fix unquoted var(--something) in style objects
    // Only matches when preceded by a colon, space, or question mark (so it ignores inside [var(...)] or quotes)
    content = content.replace(/([: \?])var\(--([a-zA-Z0-9-]+)\)/g, "$1'var(--$2)'");
    
    if (content !== old) {
       fs.writeFileSync(file, content);
       console.log('Fixed syntax in ' + file);
    }
});
