const fs = require('fs');
const path = require('path');

const replacements = {
    // CSS Variables and Global theme hexes
    '#050a18': '#f8fafc',
    '#0a1628': '#ffffff',
    '#070d1f': '#ffffff',
    '#f0f4ff': '#0f172a',
    '#94a3b8': '#475569',
    
    // Specific colors
    'rgba(7, 13, 31, 0.8)': 'rgba(255, 255, 255, 0.8)',
    'rgba(0, 0, 0, 0.4)': 'rgba(0, 0, 0, 0.08)',
    
    // White opacity to Black opacity (for borders, grid lines, hover states)
    'rgba(255,255,255,': 'rgba(0,0,0,',
    'rgba(255, 255, 255,': 'rgba(0, 0, 0,',
    
    // Recharts specific
    'stroke="rgba(255,255,255,0.05)"': 'stroke="#e2e8f0"',
    'stroke="rgba(255, 255, 255, 0.05)"': 'stroke="#e2e8f0"',
    'rgba(255,255,255,0.1)': '#e2e8f0'
};

const searchDir = "c:/Users/ayush/Desktop/Insurance_Policy_Managnement_System/frontend/src";

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;
    
    for (const [oldStr, newStr] of Object.entries(replacements)) {
        // Global replace
        content = content.split(oldStr).join(newStr);
    }
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.jsx') || file.endsWith('.css')) {
            processFile(filePath);
        }
    }
}

// Process everything
walkDir(searchDir);
console.log("Theme swap complete!");
