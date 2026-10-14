import fs from 'fs';
import path from 'path';
import readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}
async function setupEnvironment() {
    console.log('🚀 React Test Agent - Environment Setup\n');
    const envExamplePath = path.join(process.cwd(), '.env.example');
    const envPath = path.join(process.cwd(), '.env');
    // Проверяем, существует ли .env файл
    if (fs.existsSync(envPath)) {
        const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
        if (overwrite.toLowerCase() !== 'y') {
            console.log('Setup cancelled.');
            rl.close();
            return;
        }
    }
    // Запрашиваем API ключ
    const apiKey = await question('🔑 Enter your DeepSeek API key: ');
    if (!apiKey.trim()) {
        console.log('❌ API key is required. Setup cancelled.');
        rl.close();
        return;
    }
    // Читаем .env.example
    let envContent = fs.readFileSync(envExamplePath, 'utf-8');
    // Заменяем значение API ключа
    envContent = envContent.replace('DEEPSEEK_API_KEY=your_deepseek_api_key_here', `DEEPSEEK_API_KEY=${apiKey.trim()}`);
    // Записываем .env файл
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment setup completed!');
    console.log('📁 .env file created with your API key');
    console.log('\n🎯 Next steps:');
    console.log('   npm run test:generate src/components/');
    rl.close();
}
setupEnvironment().catch(console.error);
//# sourceMappingURL=setup-env.js.map