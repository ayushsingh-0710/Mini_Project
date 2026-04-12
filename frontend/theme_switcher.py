import os
import glob

replacements = {
    # CSS Variables and Global theme hexes
    '#050a18': '#f8fafc',
    '#0a1628': '#ffffff',
    '#070d1f': '#ffffff',
    '#f0f4ff': '#0f172a',
    '#94a3b8': '#475569',
    
    # Specific colors
    'rgba(7, 13, 31, 0.8)': 'rgba(255, 255, 255, 0.8)',
    'rgba(0, 0, 0, 0.4)': 'rgba(0, 0, 0, 0.08)',
    
    # White opacity to Black opacity (for borders, grid lines, hover states)
    'rgba(255,255,255,': 'rgba(0,0,0,',
    'rgba(255, 255, 255,': 'rgba(0, 0, 0,',
    
    # Recharts specific
    'stroke="rgba(0,0,0,0.05)"': 'stroke="#e2e8f0"',
    'stroke="rgba(0, 0, 0, 0.05)"': 'stroke="#e2e8f0"',
}

search_dir = "c:/Users/ayush/Desktop/Insurance_Policy_Managnement_System/frontend/src"

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")

# Process CSS
css_file = os.path.join(search_dir, "index.css")
if os.path.exists(css_file):
    process_file(css_file)

# Process JSX
for root, dirs, files in os.walk(search_dir):
    for name in files:
        if name.endswith(".jsx"):
            process_file(os.path.join(root, name))
