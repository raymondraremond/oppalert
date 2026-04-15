
const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function replaceInFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;
    if (filePath.includes('tailwind.config.ts')) return; // handled separately
    if (filePath.includes('globals.css')) return; // handled separately

    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('amber') && !content.includes('Amber')) return;

    let newContent = content.replace(/amber/g, 'emerald').replace(/Amber/g, 'Emerald');
    fs.writeFileSync(filePath, newContent);
    console.log('Updated: ' + filePath);
}

['app', 'components'].forEach(dir => {
    if (fs.existsSync(dir)) walkDir(dir, replaceInFile);
});
console.log('Done replacement in ts/tsx components.');

