
const fs = require('fs');

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content
        .replace(/rgba\(232, 160, 32/g, 'rgba(52, 194, 122')
        .replace(/rgba\(232,160,32/g, 'rgba(52,194,122')
        .replace(/#E8A020/g, '#34C27A')
        .replace(/#F5B93A/g, '#3DAA6A')
        .replace(/#D88030/g, '#2E8854')
        .replace(/#F0B030/g, '#45D486')
        .replace(/#D97706/g, '#059669')  /* amber light theme */
        .replace(/#FEF3C7/g, '#D1FAE5')  /* amber-dim light theme */
        .replace(/#3D2E0A/g, '#0F2E1C')  /* amber-dim dark theme */
        .replace(/amber/g, 'emerald')
        .replace(/Amber/g, 'Emerald');
        
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + filePath);
}

fixFile('app/globals.css');
fixFile('tailwind.config.ts');

