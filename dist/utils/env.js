import dotenv from 'dotenv';
// Загружаем .env файл
dotenv.config();
// Валидация обязательных переменных
function validateRequiredEnvVars() {
    const required = ['DEEPSEEK_API_KEY'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}\n` +
            'Please create .env file with DEEPSEEK_API_KEY');
    }
}
// Валидируем при импорте
validateRequiredEnvVars();
//# sourceMappingURL=env.js.map