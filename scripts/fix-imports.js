// scripts/fix-imports.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixImportsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Находим все импорты без расширения .js
    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    let match;
    let modified = false;

    const newContent = content.replace(importRegex, (match, importPath) => {
        // Пропускаем node_modules и внешние пакеты
        if (importPath.startsWith('.') && !importPath.endsWith('.js')) {
            modified = true;
            return `from '${importPath}.js'`;
        }
        return match;
    });

    if (modified) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`✅ Fixed imports in: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !file.includes('node_modules')) {
            walkDir(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            fixImportsInFile(fullPath);
        }
    }
}

console.log('🔧 Fixing imports...');
walkDir('src');
console.log('✅ Done!');