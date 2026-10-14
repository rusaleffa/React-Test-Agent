// src/env.ts
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем .env из корня проекта
config({ path: path.resolve(__dirname, '../.env') });

export const env = {
    // GigaChat
    GIGACHAT_CLIENT_ID: process.env.GIGACHAT_CLIENT_ID || '',
    GIGACHAT_CLIENT_SECRET: process.env.GIGACHAT_CLIENT_SECRET || '',
    GIGACHAT_SCOPE: process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS',

    // Общие
    DEFAULT_PROVIDER: process.env.DEFAULT_PROVIDER || 'gigachat',
    AGENT_TEMPERATURE: parseFloat(process.env.AGENT_TEMPERATURE || '0.3'),
    TEST_FRAMEWORK: process.env.TEST_FRAMEWORK || 'jest',
    MAX_RETRIES: parseInt(process.env.MAX_RETRIES || '3'),
    GENERATE_MOCKS: process.env.GENERATE_MOCKS === 'true',
    ENABLE_COVERAGE: process.env.ENABLE_COVERAGE === 'true',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    DEBUG_MODE: process.env.DEBUG_MODE === 'true',
} as const;

const hasGigaChat = !!env.GIGACHAT_CLIENT_ID && !!env.GIGACHAT_CLIENT_SECRET;

if (!hasGigaChat) {
    console.warn('⚠️  No API keys configured!');
    console.warn('   Please set either:');
    console.warn('   - GIGACHAT_CLIENT_ID and GIGACHAT_CLIENT_SECRET for GigaChat');
}

if (env.DEFAULT_PROVIDER === 'gigachat' && !hasGigaChat) {
    console.warn(`⚠️  GigaChat selected as default but credentials are missing!`);
    console.warn(`   Please set GIGACHAT_CLIENT_ID and GIGACHAT_CLIENT_SECRET in .env`);
}

console.log(`🔧 Default provider: ${env.DEFAULT_PROVIDER}`);