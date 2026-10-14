// src/cli/index.ts
import { Command } from 'commander';
import { ReactTestAgent } from '../core/agent/react-test-agent';
import { EnhancedReactTestAgent } from '../core/agent/enhanced-react-test-agent';
import fs from 'fs';
import path from 'path';
import { env } from "../env";
class TestAgentCLI {
    constructor() {
        this.agent = null;
        this.isEnhanced = false;
        this.setupCLI();
    }
    async initializeAgent(options, useEnhanced = true) {
        const apiKey = env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            throw new Error('DEEPSEEK_API_KEY environment variable is required');
        }
        const config = {
            apiKey,
            testFramework: options.framework,
            testingLibrary: options.library,
            coverage: true,
            generateMocks: true,
            maxRetries: 3,
            temperature: 0.3
        };
        if (useEnhanced) {
            // Создаем экземпляр EnhancedReactTestAgent - это корректно, так как он наследует от ReactTestAgent
            const enhancedAgent = new EnhancedReactTestAgent(config);
            this.agent = enhancedAgent; // Это допустимо благодаря полиморфизму
            this.isEnhanced = true;
            try {
                await enhancedAgent.initialize();
                console.log('✅ EnhancedReactTestAgent initialized successfully');
            }
            catch (error) {
                console.warn('⚠️ Enhanced agent initialization failed, but continuing with basic functionality');
            }
        }
        else {
            this.agent = new ReactTestAgent(config);
            this.isEnhanced = false;
            console.log('✅ ReactTestAgent initialized successfully');
        }
    }
    /**
     * Безопасное получение Enhanced агента
     */
    getEnhancedAgent() {
        if (!this.agent || !this.isEnhanced || !(this.agent instanceof EnhancedReactTestAgent)) {
            throw new Error('Enhanced agent is not available');
        }
        return this.agent;
    }
    /**
     * Обработчик команды enhanced-report
     */
    async handleEnhancedReport(options) {
        try {
            // Для расширенного отчета используем Enhanced агент
            if (!this.agent || !this.isEnhanced) {
                await this.initializeAgent({}, true);
            }
            const enhancedAgent = this.getEnhancedAgent();
            // Проверяем, что агент инициализирован
            if (!enhancedAgent.isInitialized()) {
                await enhancedAgent.initialize();
            }
            const report = enhancedAgent.generateEnhancedReport();
            const reportText = this.formatEnhancedReport(report);
            console.log(reportText);
            if (options.output) {
                await this.saveReportToFile(options.output, reportText, 'enhanced');
                console.log(`💾 Enhanced report saved to: ${options.output}`);
            }
        }
        catch (error) {
            console.error('❌ Error generating enhanced report:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }
    /**
     * Обработчик команды stats
     */
    async handleStats() {
        try {
            if (!this.agent) {
                // Для статистики используем базовый агент
                await this.initializeAgent({}, false);
            }
            const memory = this.agent.getMemory();
            const successRate = this.agent.getSuccessRate();
            const complexityStats = this.agent.getComplexityStats();
            const config = this.agent.getConfig();
            console.log(`
📈 Agent Statistics
===================

Agent Type: ${this.isEnhanced ? 'EnhancedReactTestAgent 🚀' : 'ReactTestAgent ⚡'}

Memory Usage:
-------------
📋 Test History Entries: ${memory.testHistory.length}
🔍 Component Analyses: ${Object.keys(memory.componentAnalysis).length}
💡 Common Patterns: ${memory.commonPatterns.length}
⚠️  Error Patterns: ${memory.errorPatterns.length}

Performance:
------------
🎯 Success Rate: ${(successRate * 100).toFixed(1)}%
📊 Components by Complexity:
   🟢 Low: ${complexityStats.low}
   🟡 Medium: ${complexityStats.medium}
   🔴 High: ${complexityStats.high}

Configuration:
--------------
🛠️  Test Framework: ${config.testFramework}
🧪 Testing Library: ${config.testingLibrary}
🎛️  Temperature: ${config.temperature}
🔁 Max Retries: ${config.maxRetries}
      `.trim());
            // Если это Enhanced агент, покажем дополнительную информацию
            if (this.isEnhanced) {
                try {
                    const enhancedAgent = this.getEnhancedAgent();
                    // Проверяем инициализацию перед вызовом методов
                    if (enhancedAgent.isInitialized()) {
                        const performance = await enhancedAgent.getPerformanceReport();
                        const projectContext = await enhancedAgent.getProjectContext();
                        console.log(`
Enhanced Features:
-----------------
📊 Performance Metrics:
   • Average Generation Time: ${performance.averageGenerationTime.toFixed(0)}ms
   • Coverage Trend: ${performance.coverageTrend.length} data points

🏗️  Project Context:
   • Tech Stack: ${projectContext.techStack.join(', ') || 'Not specified'}
   • Testing Preferences: ${Object.keys(projectContext.testingPreferences).length} configured
            `.trim());
                    }
                    else {
                        console.log('\n⚠️  Enhanced agent not fully initialized. Run a generation first.');
                    }
                }
                catch (error) {
                    console.log('\n⚠️  Enhanced features not available:', error instanceof Error ? error.message : error);
                }
            }
        }
        catch (error) {
            console.error('❌ Error getting statistics:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }
    /**
     * Обработчик команды generate (обновленный)
     */
    async handleGenerate(targetPath, options) {
        try {
            // Для генерации всегда используем Enhanced агент
            await this.initializeAgent(options, true);
            if (!fs.existsSync(targetPath)) {
                console.error(`❌ Path does not exist: ${targetPath}`);
                process.exit(1);
            }
            const stats = fs.statSync(targetPath);
            if (stats.isDirectory()) {
                await this.processDirectory(targetPath);
            }
            else {
                await this.processFile(targetPath);
            }
            // Генерация отчета после завершения
            if (options.report !== 'none') {
                console.log('\n' + '='.repeat(50));
                console.log('📊 GENERATION REPORT');
                console.log('='.repeat(50));
                const reportType = options.report === 'detailed' ? 'text' : 'basic';
                await this.handleReport({ type: reportType });
            }
        }
        catch (error) {
            console.error('❌ Error:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }
    /**
     * Обработчик команды clear-memory
     */
    async handleClearMemory() {
        try {
            if (!this.agent) {
                await this.initializeAgent({}, false);
            }
            // Если это Enhanced агент, используем его метод clearMemory
            if (this.isEnhanced) {
                const enhancedAgent = this.getEnhancedAgent();
                await enhancedAgent.clearMemory();
            }
            else {
                this.agent.clearMemory();
            }
            console.log('✅ Agent memory cleared successfully');
        }
        catch (error) {
            console.error('❌ Error clearing memory:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }
    /**
     * Обработчик команды report
     */
    async handleReport(options) {
        try {
            if (!this.agent) {
                // Для отчетов используем Enhanced агент если нужен расширенный отчет
                const useEnhanced = options.type === 'enhanced';
                await this.initializeAgent({}, useEnhanced);
            }
            let report;
            let reportText;
            switch (options.type) {
                case 'enhanced':
                    if (this.isEnhanced && this.agent instanceof EnhancedReactTestAgent) {
                        report = this.agent.generateEnhancedReport();
                        reportText = this.formatEnhancedReport(report);
                    }
                    else {
                        console.warn('⚠️  Enhanced reports require EnhancedReactTestAgent. Falling back to basic report.');
                        report = this.agent.generateReport();
                        reportText = this.formatBasicReport(report);
                    }
                    break;
                case 'text':
                    report = this.agent.getDetailedReport();
                    reportText = this.agent.exportReport('text');
                    break;
                case 'json':
                    report = this.agent.getDetailedReport();
                    reportText = JSON.stringify(report, null, 2);
                    break;
                case 'basic':
                default:
                    report = this.agent.generateReport();
                    reportText = this.formatBasicReport(report);
                    break;
            }
            // Вывод в консоль
            console.log(reportText);
            // Сохранение в файл если указан output
            if (options.output) {
                await this.saveReportToFile(options.output, reportText, options.type);
                console.log(`💾 Report saved to: ${options.output}`);
            }
        }
        catch (error) {
            console.error('❌ Error generating report:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }
    /**
     * Обработчик команды analyze
     */
    async handleAnalyze(targetPath, options) {
        try {
            // Для анализа можно использовать базовый агент
            await this.initializeAgent({}, false);
            if (!fs.existsSync(targetPath)) {
                console.error(`❌ Path does not exist: ${targetPath}`);
                process.exit(1);
            }
            const stats = fs.statSync(targetPath);
            let analyses = [];
            if (stats.isDirectory()) {
                const files = this.findReactFiles(targetPath);
                console.log(`🔍 Analyzing ${files.length} React files...`);
                for (const file of files) {
                    try {
                        const code = fs.readFileSync(file, 'utf-8');
                        const analysis = await this.agent.analyzeComponent(code);
                        analyses.push({ path: file, analysis });
                        console.log(`✅ Analyzed: ${file}`);
                    }
                    catch (error) {
                        console.log(`❌ Failed to analyze: ${file}`);
                    }
                }
            }
            else {
                const code = fs.readFileSync(targetPath, 'utf-8');
                const analysis = await this.agent.analyzeComponent(code);
                analyses.push({ path: targetPath, analysis });
            }
            // Вывод результатов анализа
            this.printAnalysisResults(analyses, options);
        }
        catch (error) {
            console.error('❌ Analysis error:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }
    // Добавляем новую команду в setupCLI
    setupCLI() {
        const program = new Command();
        program
            .name('react-test-agent')
            .description('AI-powered React test generator')
            .version('1.0.0');
        program
            .command('generate <path>')
            .description('Generate tests for React component or directory (uses Enhanced agent)')
            .option('-f, --framework <type>', 'Test framework', 'jest')
            .option('-l, --library <type>', 'Testing library', 'react-testing-library')
            .option('-r, --report <type>', 'Generate report after: none, basic, detailed', 'basic')
            .action(async (path, options) => {
            await this.handleGenerate(path, options);
        });
        program
            .command('report')
            .description('Generate test generation report')
            .option('-t, --type <type>', 'Report type: basic, enhanced, text, json', 'basic')
            .option('-o, --output <path>', 'Output file path (optional)')
            .action(async (options) => {
            await this.handleReport(options);
        });
        program
            .command('enhanced-report')
            .description('Generate enhanced test generation report (requires Enhanced agent)')
            .option('-o, --output <path>', 'Output file path (optional)')
            .action(async (options) => {
            await this.handleEnhancedReport(options);
        });
        program
            .command('analyze <path>')
            .description('Analyze component without generating tests (uses Basic agent)')
            .option('-o, --output <path>', 'Output file path for analysis (optional)')
            .action(async (path, options) => {
            await this.handleAnalyze(path, options);
        });
        program
            .command('stats')
            .description('Show agent statistics')
            .action(async () => {
            await this.handleStats();
        });
        program
            .command('clear-memory')
            .description('Clear agent memory')
            .action(async () => {
            await this.handleClearMemory();
        });
        program
            .command('provider <type>')
            .description('Switch LLM provider: deepseek | gigachat')
            .action(async (type) => {
            try {
                if (!this.agent) {
                    await this.initializeAgent({}, type === 'gigachat');
                }
                if (this.agent) {
                    this.agent.switchProvider(type);
                    console.log(`✅ Switched to ${type} provider`);
                }
            }
            catch (error) {
                console.error('❌ Error switching provider:', error);
            }
        });
        program.parse();
    }
    /**
     * Форматирует базовый отчет
     */
    formatBasicReport(report) {
        return `
📊 React Test Agent - Basic Report
==================================

Summary:
--------
✅ Total Components: ${report.summary.totalComponents}
✅ Successful Tests: ${report.summary.successfulTests}
📈 Success Rate: ${report.summary.successRate}
🔍 Components Analyzed: ${report.summary.componentsAnalyzed}

Complexity Breakdown:
--------------------
🟢 Low Complexity: ${report.complexityBreakdown.low}
🟡 Medium Complexity: ${report.complexityBreakdown.medium} 
🔴 High Complexity: ${report.complexityBreakdown.high}

Recent Activity:
---------------
${report.recentActivity.length > 0 ?
            report.recentActivity.map((activity) => `• ${activity.component} - ${activity.success ? '✅' : '❌'} (${activity.duration}ms)`).join('\n') :
            'No recent activity'}

Discovery:
----------
💡 Patterns Discovered: ${report.patternsDiscovered}
⚠️  Common Errors: ${report.commonErrors}
    `.trim();
    }
    /**
     * Форматирует расширенный отчет
     */
    formatEnhancedReport(report) {
        return `
📈 React Test Agent - Enhanced Report
=====================================

Performance Summary:
-------------------
✅ Success Rate: ${(report.memory.performance.successRate * 100).toFixed(1)}%
⏱️  Avg Generation Time: ${report.memory.performance.averageGenerationTime.toFixed(0)}ms
📊 Total Executions: ${report.memory.trends.totalExecutions}

Memory Statistics:
-----------------
💾 Test Executions: ${report.memory.testExecutions}
🗂️  Cached Components: ${report.memory.cachedComponents}
🛠️  Tech Stack: ${report.memory.projectTechStack.join(', ') || 'Not specified'}

Trend Analysis:
---------------
📈 Trend: ${report.trends.trend === 'improving' ? '🟢 Improving' : '🟡 Needs Attention'}
🎯 Recent Success: ${(report.trends.recentSuccessRate * 100).toFixed(1)}%

Recommendations:
---------------
${report.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

Component Breakdown:
------------------
🟢 Low: ${report.complexityBreakdown.low}
🟡 Medium: ${report.complexityBreakdown.medium}
🔴 High: ${report.complexityBreakdown.high}
    `.trim();
    }
    /**
     * Сохраняет отчет в файл
     */
    async saveReportToFile(filePath, content, reportType) {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        let finalContent = content;
        if (reportType === 'json') {
            finalContent = content; // JSON уже отформатирован
        }
        await fs.promises.writeFile(filePath, finalContent, 'utf-8');
    }
    /**
     * Выводит результаты анализа
     */
    printAnalysisResults(analyses, options) {
        const output = analyses.map(item => ({
            path: item.path,
            complexity: item.analysis.complexity,
            type: item.analysis.componentType,
            props: item.analysis.props.length,
            states: item.analysis.states.length,
            dependencies: item.analysis.dependencies.length
        }));
        if (options.output) {
            // Сохранение в файл
            fs.writeFileSync(options.output, JSON.stringify(output, null, 2));
            console.log(`💾 Analysis saved to: ${options.output}`);
        }
        else {
            // Вывод в консоль
            console.log('\n📋 Analysis Results:');
            console.table(output);
        }
    }
    async processFile(filePath) {
        try {
            const code = fs.readFileSync(filePath, 'utf-8');
            const result = await this.agent.generateCompleteTests(code, filePath);
            // Создаем директорию для тестов если не существует
            const testDir = path.dirname(result.filePath);
            if (!fs.existsSync(testDir)) {
                fs.mkdirSync(testDir, { recursive: true });
            }
            // Сохраняем тесты в файл
            fs.writeFileSync(result.filePath, result.testCode);
            console.log(`✅ Tests saved to: ${result.filePath}`);
        }
        catch (error) {
            console.error(`❌ Failed to process file ${filePath}:`, error instanceof Error ? error.message : error);
        }
    }
    async processDirectory(dirPath) {
        const files = this.findReactFiles(dirPath);
        console.log(`📁 Found ${files.length} React files in ${dirPath}`);
        let successCount = 0;
        let errorCount = 0;
        for (const file of files) {
            try {
                await this.processFile(file);
                successCount++;
            }
            catch (error) {
                errorCount++;
                console.log(`❌ Failed: ${file}`);
            }
        }
        console.log(`\n📊 Batch processing completed:`);
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📈 Success rate: ${((successCount / files.length) * 100).toFixed(1)}%`);
    }
    findReactFiles(dirPath) {
        const results = [];
        const walk = (currentPath) => {
            const files = fs.readdirSync(currentPath);
            for (const file of files) {
                const fullPath = path.join(currentPath, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory() &&
                    !file.includes('node_modules') &&
                    !file.includes('__tests__') &&
                    !file.startsWith('.')) {
                    walk(fullPath);
                }
                else if ((file.endsWith('.jsx') ||
                    file.endsWith('.tsx') ||
                    file.endsWith('.js')) &&
                    !file.includes('.test.') &&
                    !file.includes('.spec.')) {
                    results.push(fullPath);
                }
            }
        };
        walk(dirPath);
        return results;
    }
}
// Запуск CLI
new TestAgentCLI();
//# sourceMappingURL=index.js.map