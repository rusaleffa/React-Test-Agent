import { Command } from 'commander';
import { ReactTestAgent } from '../core/agent/react-test-agent';
import { EnhancedReactTestAgent } from '../core/agent/enhanced-react-test-agent';
import { AgentConfig, ComponentAnalysis } from '../types/agent';
import { TestType } from '../tools/testGenerator/types';
import fs from 'fs';
import path from 'path';
import { env } from '../env';

class TestAgentCLI {
    private agent: ReactTestAgent | null = null;
    private isEnhanced: boolean = false;

    // Возвращает существующий агент или создаёт новый нужного типа
    private async getAgent(useEnhanced: boolean = true, options: any = {}): Promise<ReactTestAgent> {
        if (this.agent && this.isEnhanced === useEnhanced) {
            return this.agent;
        }

        const config = this.buildConfig(options);
        let newAgent: ReactTestAgent;

        if (useEnhanced) {
            const enhancedAgent = new EnhancedReactTestAgent(config);
            newAgent = enhancedAgent;
            this.isEnhanced = true;
            try {
                await enhancedAgent.initialize();
                console.log('✅ EnhancedReactTestAgent инициализирован');
            } catch (error) {
                console.warn('⚠️ Инициализация enhanced-агента не удалась, продолжаем в базовом режиме');
            }
        } else {
            newAgent = new ReactTestAgent(config);
            this.isEnhanced = false;
            console.log('✅ ReactTestAgent инициализирован');
        }

        this.agent = newAgent;
        return newAgent;
    }

    private buildConfig(options: any): AgentConfig {
        const providerType = env.DEFAULT_PROVIDER;

        if (providerType === 'gigachat' && (!env.GIGACHAT_CLIENT_ID || !env.GIGACHAT_CLIENT_SECRET)) {
            throw new Error('Для GigaChat нужны GIGACHAT_CLIENT_ID и GIGACHAT_CLIENT_SECRET');
        }

        return {
            clientId: env.GIGACHAT_CLIENT_ID || undefined,
            clientSecret: env.GIGACHAT_CLIENT_SECRET || undefined,
            testFramework: (options.framework as 'jest' | 'vitest') || 'jest',
            testingLibrary: (options.library as 'react-testing-library' | 'enzyme') || 'react-testing-library',
            temperature: env.AGENT_TEMPERATURE,
            coverage: env.ENABLE_COVERAGE,
            generateMocks: env.GENERATE_MOCKS,
            maxRetries: env.MAX_RETRIES,
            providerType,
        };
    }

    private getEnhancedAgent(): EnhancedReactTestAgent {
        if (!this.agent || !this.isEnhanced || !(this.agent instanceof EnhancedReactTestAgent)) {
            throw new Error('Enhanced-агент недоступен');
        }
        return this.agent;
    }

    // Разбор строки "unit,integration" в массив TestType
    private parseTypes(typeStr: string): TestType[] {
        const typeNames = typeStr.split(',').map(t => t.trim().toLowerCase());
        const validTypes = Object.values(TestType) as string[];
        return typeNames.filter(t => validTypes.includes(t)).map(t => t as TestType);
    }

    private async handleGenerate(targetPath: string, options: any): Promise<void> {
        try {
            const agent = await this.getAgent(true, options);

            let testTypes: TestType[] | undefined;
            let excludeTypes: TestType[] | undefined;

            if (options.all) {
                testTypes = Object.values(TestType);
            } else if (options.types) {
                testTypes = this.parseTypes(options.types);
            }
            if (options.exclude) {
                excludeTypes = this.parseTypes(options.exclude);
            }

            if (!fs.existsSync(targetPath)) {
                console.error(`❌ Путь не найден: ${targetPath}`);
                process.exit(1);
            }

            const stats = fs.statSync(targetPath);
            if (stats.isDirectory()) {
                await this.processDirectory(targetPath, agent, { testTypes, exclude: excludeTypes });
            } else {
                await this.processFile(targetPath, agent, { testTypes, exclude: excludeTypes });
            }

            if (options.report !== 'none') {
                console.log('\n' + '='.repeat(50));
                console.log('📊 ОТЧЁТ О ГЕНЕРАЦИИ');
                console.log('='.repeat(50));
                await this.handleReport({ type: options.report === 'detailed' ? 'text' : 'basic' });
            }
        } catch (error) {
            console.error('❌ Ошибка:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }

    private async handleReport(options: { type: string; output?: string }): Promise<void> {
        try {
            const useEnhanced = options.type === 'enhanced';
            const agent = await this.getAgent(useEnhanced, {});

            let reportText: string;

            switch (options.type) {
                case 'enhanced':
                    if (agent instanceof EnhancedReactTestAgent) {
                        reportText = this.formatEnhancedReport(agent.generateEnhancedReport());
                    } else {
                        console.warn('⚠️ Enhanced-отчёт требует EnhancedReactTestAgent. Падаем в базовый.');
                        reportText = this.formatBasicReport(agent.generateReport());
                    }
                    break;
                case 'text':
                    reportText = agent.exportReport('text') as string;
                    break;
                case 'json':
                    reportText = JSON.stringify(agent.getDetailedReport(), null, 2);
                    break;
                case 'basic':
                default:
                    reportText = this.formatBasicReport(agent.generateReport());
                    break;
            }

            console.log(reportText);

            if (options.output) {
                await this.saveReportToFile(options.output, reportText);
                console.log(`💾 Отчёт сохранён: ${options.output}`);
            }
        } catch (error) {
            console.error('❌ Ошибка формирования отчёта:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }

    private async handleStats(): Promise<void> {
        try {
            const agent = await this.getAgent(false, {});
            const memory = agent.getMemory();
            const successRate = agent.getSuccessRate();
            const complexityStats = agent.getComplexityStats();
            const config = agent.getConfig();

            console.log(`
📈 Статистика агента
====================
Тип агента: ${agent instanceof EnhancedReactTestAgent ? 'EnhancedReactTestAgent 🚀' : 'ReactTestAgent ⚡'}

Использование памяти:
---------------------
📋 Записей в истории: ${memory.testHistory.length}
🔍 Проанализировано компонентов: ${memory.componentAnalysis.size}
💡 Общих паттернов: ${memory.commonPatterns.length}
⚠️  Паттернов ошибок: ${memory.errorPatterns.length}

Производительность:
-------------------
🎯 Процент успеха: ${(successRate * 100).toFixed(1)}%
📊 Компоненты по сложности:
   🟢 Low: ${complexityStats.low}
   🟡 Medium: ${complexityStats.medium}
   🔴 High: ${complexityStats.high}

Конфигурация:
-------------
🛠️  Фреймворк: ${config.testFramework}
🧪 Библиотека: ${config.testingLibrary}
🎛️  Temperature: ${config.temperature}
🔁 Max retries: ${config.maxRetries}
            `.trim());

            if (agent instanceof EnhancedReactTestAgent && agent.isInitialized()) {
                try {
                    const performance = await agent.getPerformanceReport();
                    const projectContext = await agent.getProjectContext();
                    console.log(`
Enhanced-возможности:
---------------------
📊 Метрики производительности:
   • Среднее время генерации: ${performance.averageGenerationTime.toFixed(0)}мс
   • Точек в тренде покрытия: ${performance.coverageTrend.length}

🏗️  Контекст проекта:
   • Tech stack: ${projectContext.techStack.join(', ') || 'не задан'}
   • Настроек тестирования: ${Object.keys(projectContext.testingPreferences).length}
                    `.trim());
                } catch (error) {
                    console.log('\n⚠️ Enhanced-возможности недоступны:', error instanceof Error ? error.message : error);
                }
            }
        } catch (error) {
            console.error('❌ Ошибка получения статистики:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }

    private async handleClearMemory(): Promise<void> {
        try {
            const agent = await this.getAgent(false, {});
            if (agent instanceof EnhancedReactTestAgent) {
                await agent.clearMemory();
            } else {
                agent.clearMemory();
            }
            console.log('✅ Память агента очищена');
        } catch (error) {
            console.error('❌ Ошибка очистки памяти:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }

    private async handleAnalyze(targetPath: string, options: any): Promise<void> {
        try {
            const agent = await this.getAgent(false, {});
            if (!fs.existsSync(targetPath)) {
                console.error(`❌ Путь не найден: ${targetPath}`);
                process.exit(1);
            }

            const stats = fs.statSync(targetPath);
            const analyses: Array<{ path: string; analysis: ComponentAnalysis }> = [];

            if (stats.isDirectory()) {
                const files = this.findReactFiles(targetPath);
                console.log(`🔍 Анализ ${files.length} React-файлов...`);
                for (const file of files) {
                    try {
                        const code = fs.readFileSync(file, 'utf-8');
                        const analysis = await agent.analyzeComponent(code);
                        analyses.push({ path: file, analysis });
                        console.log(`✅ Проанализирован: ${file}`);
                    } catch {
                        console.log(`❌ Не удалось: ${file}`);
                    }
                }
            } else {
                const code = fs.readFileSync(targetPath, 'utf-8');
                const analysis = await agent.analyzeComponent(code);
                analyses.push({ path: targetPath, analysis });
            }

            this.printAnalysisResults(analyses, options);
        } catch (error) {
            console.error('❌ Ошибка анализа:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }

    private async processFile(
        filePath: string,
        agent: ReactTestAgent,
        genOptions?: { testTypes?: TestType[]; exclude?: TestType[] }
    ): Promise<void> {
        try {
            const code = fs.readFileSync(filePath, 'utf-8');
            const result = await agent.generateCompleteTests(code, filePath, genOptions);

            // Дополнительная страховка: ещё раз чистим markdown и текст перед кодом
            let testCode = result.testCode
                .replace(/```\w*\s*/g, '')
                .replace(/```/g, '');

            const match = testCode.match(/(?:import|describe|export|const|function)/);
            if (match) {
                testCode = testCode.substring(testCode.indexOf(match[0]));
            }
            testCode = testCode.trimStart();

            if (!testCode.includes('import')) {
                testCode = `import { render, screen, waitFor } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\n\n${testCode}`;
            }

            const testDir = path.dirname(result.filePath);
            if (!fs.existsSync(testDir)) {
                fs.mkdirSync(testDir, { recursive: true });
            }

            fs.writeFileSync(result.filePath, testCode);
            console.log(`✅ Тесты сохранены: ${result.filePath}`);
            console.log(`📝 Размер файла: ${testCode.length} байт`);
        } catch (error) {
            console.error(`❌ Ошибка обработки ${filePath}:`, error instanceof Error ? error.message : error);
        }
    }

    private async processDirectory(
        dirPath: string,
        agent: ReactTestAgent,
        genOptions?: { testTypes?: TestType[]; exclude?: TestType[] }
    ): Promise<void> {
        const files = this.findReactFiles(dirPath);
        console.log(`📁 Найдено ${files.length} React-файлов в ${dirPath}`);

        let successCount = 0;
        let errorCount = 0;

        for (const file of files) {
            try {
                await this.processFile(file, agent, genOptions);
                successCount++;
            } catch {
                errorCount++;
                console.log(`❌ Не удалось: ${file}`);
            }
        }

        console.log(`\n📊 Обработка завершена:`);
        console.log(`✅ Успешно: ${successCount}`);
        console.log(`❌ Ошибок: ${errorCount}`);
        console.log(`📈 Процент успеха: ${((successCount / files.length) * 100).toFixed(1)}%`);
    }

    // Рекурсивно собирает React-файлы, пропуская служебные директории.
    // Проверка по полному пути, а не по имени файла — иначе `__tests__` не отсеивались бы.
    private findReactFiles(dirPath: string): string[] {
        const results: string[] = [];
        const walk = (currentPath: string) => {
            const files = fs.readdirSync(currentPath);
            for (const file of files) {
                const fullPath = path.join(currentPath, file);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (
                        !fullPath.includes('node_modules') &&
                        !fullPath.includes('__tests__') &&
                        !file.startsWith('.')
                    ) {
                        walk(fullPath);
                    }
                } else if (
                    (file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.js')) &&
                    !file.includes('.test.') &&
                    !file.includes('.spec.')
                ) {
                    results.push(fullPath);
                }
            }
        };
        walk(dirPath);
        return results;
    }

    private printAnalysisResults(
        analyses: Array<{ path: string; analysis: ComponentAnalysis }>,
        options: any
    ): void {
        const output = analyses.map(item => ({
            path: item.path,
            complexity: item.analysis.complexity,
            type: item.analysis.componentType,
            props: item.analysis.props.length,
            states: item.analysis.states.length,
            dependencies: item.analysis.dependencies.length,
        }));

        if (options.output) {
            fs.writeFileSync(options.output, JSON.stringify(output, null, 2));
            console.log(`💾 Анализ сохранён: ${options.output}`);
        } else {
            console.log('\n📋 Результаты анализа:');
            console.table(output);
        }
    }

    private formatBasicReport(report: any): string {
        return `
📊 React Test Agent — Базовый отчёт
===================================

Сводка:
-------
✅ Всего компонентов: ${report.summary.totalComponents}
✅ Успешных тестов: ${report.summary.successfulTests}
📈 Процент успеха: ${report.summary.successRate}
🔍 Проанализировано: ${report.summary.componentsAnalyzed}

По сложности:
-------------
🟢 Low: ${report.complexityBreakdown.low}
🟡 Medium: ${report.complexityBreakdown.medium}
🔴 High: ${report.complexityBreakdown.high}

Последняя активность:
---------------------
${report.recentActivity.length > 0
            ? report.recentActivity.map((a: any) =>
                `• ${a.component} — ${a.success ? '✅' : '❌'} (${a.duration}мс)`
            ).join('\n')
            : 'Активности пока нет'}

Найдено:
--------
💡 Паттернов: ${report.patternsDiscovered}
⚠️  Частых ошибок: ${report.commonErrors}
`.trim();
    }

    private formatEnhancedReport(report: any): string {
        return `
📈 React Test Agent — Enhanced-отчёт
====================================

Производительность:
-------------------
✅ Процент успеха: ${(report.memory.performance.successRate * 100).toFixed(1)}%
⏱️  Среднее время: ${report.memory.performance.averageGenerationTime.toFixed(0)}мс
📊 Всего запусков: ${report.memory.trends.totalExecutions}

Память:
-------
💾 Записей: ${report.memory.testExecutions}
🗂️  Кэшировано: ${report.memory.cachedComponents}
🛠️  Tech stack: ${report.memory.projectTechStack.join(', ') || 'не задан'}

Тренды:
-------
📈 Тренд: ${report.trends.trend === 'improving' ? '🟢 Улучшается' : '🟡 Требует внимания'}
🎯 Недавний успех: ${(report.trends.recentSuccessRate * 100).toFixed(1)}%

Рекомендации:
-------------
${report.recommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}

По сложности:
-------------
🟢 Low: ${report.complexityBreakdown.low}
🟡 Medium: ${report.complexityBreakdown.medium}
🔴 High: ${report.complexityBreakdown.high}
`.trim();
    }

    private async saveReportToFile(filePath: string, content: string): Promise<void> {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        await fs.promises.writeFile(filePath, content, 'utf-8');
    }

    private setupCLI(): void {
        const program = new Command();

        program
            .name('react-test-agent')
            .description('ИИ-генератор тестов для React-компонентов')
            .version('1.0.0');

        program
            .command('generate <path>')
            .description('Сгенерировать тесты для компонента или директории')
            .option('-f, --framework <type>', 'Фреймворк тестирования', 'jest')
            .option('-l, --library <type>', 'Библиотека', 'react-testing-library')
            .option('-t, --types <types>', 'Список типов через запятую (unit,integration,e2e,snapshot,visual,performance)')
            .option('-x, --exclude <types>', 'Список типов для исключения')
            .option('--all', 'Сгенерировать все типы тестов')
            .option('-r, --report <type>', 'Отчёт после генерации: none, basic, detailed', 'basic')
            .action(async (targetPath, options) => {
                await this.handleGenerate(targetPath, options);
            });

        program
            .command('report')
            .description('Сгенерировать отчёт о генерации')
            .option('-t, --type <type>', 'Тип отчёта: basic, enhanced, text, json', 'basic')
            .option('-o, --output <path>', 'Путь для сохранения')
            .action(async (options) => {
                await this.handleReport(options);
            });

        program
            .command('enhanced-report')
            .description('Сгенерировать enhanced-отчёт')
            .option('-o, --output <path>', 'Путь для сохранения')
            .action(async (options) => {
                await this.handleReport({ type: 'enhanced', output: options.output });
            });

        program
            .command('analyze <path>')
            .description('Проанализировать компонент без генерации тестов')
            .option('-o, --output <path>', 'Путь для сохранения анализа')
            .action(async (targetPath, options) => {
                await this.handleAnalyze(targetPath, options);
            });

        program
            .command('stats')
            .description('Показать статистику агента')
            .action(async () => {
                await this.handleStats();
            });

        program
            .command('clear-memory')
            .description('Очистить память агента')
            .action(async () => {
                await this.handleClearMemory();
            });

        program.parse();
    }

    constructor() {
        this.setupCLI();
    }
}

new TestAgentCLI();