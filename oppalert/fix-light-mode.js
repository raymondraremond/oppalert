
const fs = require('fs');

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let text = fs.readFileSync(filePath, 'utf8');
    
    let updated = text
        .split('bg-[#020604]').join('bg-bg2')
        .split('#ffffff05').join('var(--border)')
        .split('border-white/10').join('border-border')
        .split('border-white/5').join('border-border')
        .split('bg-white/5').join('bg-surface2')
        .split('bg-white/').join('bg-surface/')
        .split('text-emerald-400').join('text-emerald')
        .split('text-emerald-100/70').join('text-muted')
        .split('emerald-500').join('emerald')
        .split('text-white').join('text-primary');

    fs.writeFileSync(filePath, updated);
    console.log('Fixed ' + filePath);
}

fixFile('app/page.tsx');

