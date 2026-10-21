import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем .env из корня проекта (на уровень выше dist/src/env.js)
config({ path: path.resolve(__dirname, '../.env') });

// parseFloat/parseInt могут вернуть NaN при кривом .env — подстраховываемся дефолтом
function parseFloatSafe(raw: string | undefined, fallback: number): number {
    const value = parseFloat(raw ?? '');
    return Number.isFinite(value) ? value : fallback;
}

function parseIntSafe(raw: string | undefined, fallback: number): number {
    const value = parseInt(raw ?? '', 10);
    return Number.isFinite(value) ? value : fallback;
}

export const env = {
    // Учётные данные GigaChat
    GIGACHAT_CLIENT_ID: process.env.GIGACHAT_CLIENT_ID || '',
    GIGACHAT_CLIENT_SECRET: process.env.GIGACHAT_CLIENT_SECRET || '',
    GIGACHAT_SCOPE: process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS',

    // Настройки агента
    DEFAULT_PROVIDER: (process.env.DEFAULT_PROVIDER || 'gigachat') as 'gigachat',
    AGENT_TEMPERATURE: parseFloatSafe(process.env.AGENT_TEMPERATURE, 0.3),
    MAX_RETRIES: parseIntSafe(process.env.MAX_RETRIES, 3),

    // Тестирование
    TEST_FRAMEWORK: (process.env.TEST_FRAMEWORK || 'jest') as 'jest' | 'vitest',
    GENERATE_MOCKS: process.env.GENERATE_MOCKS === 'true',
    ENABLE_COVERAGE: process.env.ENABLE_COVERAGE === 'true',

    // Логирование
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    DEBUG_MODE: process.env.DEBUG_MODE === 'true',
} as const;

// Ранняя проверка: без ключей GigaChat агент работать не будет
const hasGigaChatCredentials = !!env.GIGACHAT_CLIENT_ID && !!env.GIGACHAT_CLIENT_SECRET;

if (!hasGigaChatCredentials) {
    console.warn('⚠️  Учётные данные GigaChat не заданы.');
    console.warn('   Установите GIGACHAT_CLIENT_ID и GIGACHAT_CLIENT_SECRET в .env');
}