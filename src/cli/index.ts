// src/cli/index.ts
import { Command } from 'commander';
import { ReactTestAgent } from '../core/agent/react-test-agent';
import { EnhancedReactTestAgent } from '../core/agent/enhanced-react-test-agent';
import { AgentConfig, ComponentAnalysis } from '../types/agent';
import { TestType } from '../tools/testGenerator/types';
import fs from 'fs';
import path from 'path';
import { env } from "../env";

class TestAgentCLI {
    private agent: ReactTestAgent | null = null;
    private isEnhanced: boolean = false;

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
                console.log('✅ EnhancedReactTestAgent initialized successfully');
            } catch (error) {
                console.warn('⚠️ Enhanced agent initialization failed, but continuing with basic functionality');
            }
        } else {
            newAgent = new ReactTestAgent(config);
            this.isEnhanced = false;
            console.log('✅ ReactTestAgent initialized successfully');
        }

        this.agent = newAgent;
        return newAgent;
    }

    private buildConfig(options: any): AgentConfig {
        const providerType = 'gigachat';

        if (providerType === 'gigachat' && (!env.GIGACHAT_CLIENT_ID || !env.GIGACHAT_CLIENT_SECRET)) {
            throw new Error('GIGACHAT_CLIENT_ID and GIGACHAT_CLIENT_SECRET are required for GigaChat');
        }

        return {
            clientId: env.GIGACHAT_CLIENT_ID || undefined,
            clientSecret: env.GIGACHAT_CLIENT_SECRET || undefined,
            testFramework: options.framework as 'jest' | 'vitest' || 'jest',
            testingLibrary: options.library as 'react-testing-library' | 'enzyme' || 'react-testing-library',
            temperature: env.AGENT_TEMPERATURE || 0.3,
            coverage: true,
            generateMocks: true,
            maxRetries: 3,
            providerType: 'gigachat'
        };
    }

    private getEnhancedAgent(): EnhancedReactTestAgent {
        if (!this.agent || !this.isEnhanced || !(this.agent instanceof EnhancedReactTestAgent)) {
            throw new Error('Enhanced agent is not available');
        }
        return this.agent;
    }

    // --- ПАРСИНГ ТИПОВ ---
    private parseTypes(typeStr: string): TestType[] {
        const typeNames = typeStr.split(',').map(t => t.trim().toLowerCase());
        const validTypes = Object.values(TestType) as string[];
        return typeNames.filter(t => validTypes.includes(t)).map(t => t as TestType);
    }

    // --- ОБРАБОТЧИК GENERATE ---
    private async handleGenerate(targetPath: string, options: any): Promise<void> {
        try {
            const agent = await this.getAgent(true, options);

            // Определяем типы тестов
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
                console.error(`❌ Path does not exist: ${targetPath}`);
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
                console.log('📊 GENERATION REPORT');
                console.log('='.repeat(50));
                await this.handleReport({ type: options.report === 'detailed' ? 'text' : 'basic' });
            }

        } catch (error) {
            console.error('❌ Error:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }

    // --- ОБРАБОТЧИК REPORT ---
    private async handleReport(options: { type: string; output?: string }): Promise<void> {
        try {
            const useEnhanced = options.type === 'enhanced';
            const agent = await this.getAgent(useEnhanced, {});

            let report: any;
            let reportText: string;

            switch (options.type) {
                case 'enhanced':
                    if (this.isEnhanced && agent instanceof EnhancedReactTestAgent) {
                        report = agent.generateEnhancedReport();
                        reportText = this.formatEnhancedReport(report);
                    } else {
                        console.warn('⚠️  Enhanced reports require EnhancedReactTestAgent. Falling back to basic report.');
                        report = agent.generateReport();
                        reportText = this.formatBasicReport(report);
                    }
                    break;
                case 'text':
                    report = agent.getDetailedReport();
                    reportText = agent.exportReport('text') as string;
                    break;
                case 'json':
                    report = agent.getDetailedReport();
                    reportText = JSON.stringify(report, null, 2);
                    break;
                case 'basic':
                default:
                    report = agent.generateReport();
                    reportText = this.formatBasicReport(report);
                    break;
            }

            console.log(reportText);

            if (options.output) {
                await this.saveReportToFile(options.output, reportText, options.type);
                console.log(`💾 Report saved to: ${options.output}`);
            }

        } catch (error) {
            console.error('❌ Error generating report:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }

    // --- ОБРАБОТЧИК STATS ---
    private async handleStats(): Promise<void> {
        try {
            const agent = await this.getAgent(false, {});
            const memory = agent.getMemory();
            const successRate = agent.getSuccessRate();
            const complexityStats = agent.getComplexityStats();
            const config = agent.getConfig();

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

            if (this.isEnhanced) {
                try {
                    const enhancedAgent = this.getEnhancedAgent();
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
                    } else {
                        console.log('\n⚠️  Enhanced agent not fully initialized. Run a generation first.');
                    }
                } catch (error) {
                    console.log('\n⚠️  Enhanced features not available:', error instanceof Error ? error.message : error);
                }
            }

        } catch (error) {
            console.error('❌ Error getting statistics:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }

    // --- ОБРАБОТЧИК CLEAR-MEMORY ---
    private async handleClearMemory(): Promise<void> {
        try {
            const agent = await this.getAgent(false, {});
            if (this.isEnhanced) {
                const enhancedAgent = this.getEnhancedAgent();
                await enhancedAgent.clearMemory();
            } else {
                agent.clearMemory();
            }
            console.log('✅ Agent memory cleared successfully');
        } catch (error) {
            console.error('❌ Error clearing memory:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }

    // --- ОБРАБОТЧИК ANALYZE ---
    private async handleAnalyze(targetPath: string, options: any): Promise<void> {
        try {
            const agent = await this.getAgent(false, {});
            if (!fs.existsSync(targetPath)) {
                console.error(`❌ Path does not exist: ${targetPath}`);
                process.exit(1);
            }

            const stats = fs.statSync(targetPath);
            let analyses: Array<{ path: string; analysis: ComponentAnalysis }> = [];

            if (stats.isDirectory()) {
                const files = this.findReactFiles(targetPath);
                console.log(`🔍 Analyzing ${files.length} React files...`);
                for (const file of files) {
                    try {
                        const code = fs.readFileSync(file, 'utf-8');
                        const analysis = await agent.analyzeComponent(code);
                        analyses.push({ path: file, analysis });
                        console.log(`✅ Analyzed: ${file}`);
                    } catch (error) {
                        console.log(`❌ Failed to analyze: ${file}`);
                    }
                }
            } else {
                const code = fs.readFileSync(targetPath, 'utf-8');
                const analysis = await agent.analyzeComponent(code);
                analyses.push({ path: targetPath, analysis });
            }

            this.printAnalysisResults(analyses, options);
        } catch (error) {
            console.error('❌ Analysis error:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }

    // --- ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ---

    private async processFile(
        filePath: string,
        agent: ReactTestAgent,
        genOptions?: { testTypes?: TestType[]; exclude?: TestType[] }
    ): Promise<void> {
        try {
            const code = fs.readFileSync(filePath, 'utf-8');
            const result = await agent.generateCompleteTests(code, filePath, genOptions);

            let testCode = result.testCode;
            testCode = testCode.replace(/```\w*\s*/g, '');
            testCode = testCode.replace(/```/g, '');

            const match = testCode.match(/(?:import|describe|export|const|function)/);
            if (match) {
                const startIndex = testCode.indexOf(match[0]);
                testCode = testCode.substring(startIndex);
            }
            testCode = testCode.trimStart();

            if (!testCode.includes('import')) {
                const imports = `import { render, screen, waitFor } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\n\n`;
                testCode = imports + testCode;
            }

            const testDir = path.dirname(result.filePath);
            if (!fs.existsSync(testDir)) {
                fs.mkdirSync(testDir, { recursive: true });
            }

            fs.writeFileSync(result.filePath, testCode);
            console.log(`✅ Tests saved to: ${result.filePath}`);
            console.log(`📝 Test file size: ${testCode.length} bytes`);

        } catch (error) {
            console.error(`❌ Failed to process file ${filePath}:`, error instanceof Error ? error.message : error);
        }
    }

    private async processDirectory(
        dirPath: string,
        agent: ReactTestAgent,
        genOptions?: { testTypes?: TestType[]; exclude?: TestType[] }
    ): Promise<void> {
        const files = this.findReactFiles(dirPath);
        console.log(`📁 Found ${files.length} React files in ${dirPath}`);

        let successCount = 0;
        let errorCount = 0;

        for (const file of files) {
            try {
                await this.processFile(file, agent, genOptions);
                successCount++;
            } catch (error) {
                errorCount++;
                console.log(`❌ Failed: ${file}`);
            }
        }

        console.log(`\n📊 Batch processing completed:`);
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📈 Success rate: ${((successCount / files.length) * 100).toFixed(1)}%`);
    }

    private findReactFiles(dirPath: string): string[] {
        const results: string[] = [];
        const walk = (currentPath: string) => {
            const files = fs.readdirSync(currentPath);
            for (const file of files) {
                const fullPath = path.join(currentPath, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory() &&
                    !file.includes('node_modules') &&
                    !file.includes('__tests__') &&
                    !file.startsWith('.')) {
                    walk(fullPath);
                } else if (
                    (file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.js')) &&
                    !file.includes('.test.') && !file.includes('.spec.')
                ) {
                    results.push(fullPath);
                }
            }
        };
        walk(dirPath);
        return results;
    }

    private printAnalysisResults(analyses: Array<{ path: string; analysis: ComponentAnalysis }>, options: any): void {
        const output = analyses.map(item => ({
            path: item.path,
            complexity: item.analysis.complexity,
            type: item.analysis.componentType,
            props: item.analysis.props.length,
            states: item.analysis.states.length,
            dependencies: item.analysis.dependencies.length
        }));

        if (options.output) {
            fs.writeFileSync(options.output, JSON.stringify(output, null, 2));
            console.log(`💾 Analysis saved to: ${options.output}`);
        } else {
            console.log('\n📋 Analysis Results:');
            console.table(output);
        }
    }

    private formatBasicReport(report: any): string {
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
            report.recentActivity.map((activity: any) =>
                `• ${activity.component} - ${activity.success ? '✅' : '❌'} (${activity.duration}ms)`
            ).join('\n') :
            'No recent activity'
        }

Discovery:
----------
💡 Patterns Discovered: ${report.patternsDiscovered}
⚠️  Common Errors: ${report.commonErrors}
    `.trim();
    }

    private formatEnhancedReport(report: any): string {
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
${report.recommendations.map((rec: string, index: number) =>
            `${index + 1}. ${rec}`
        ).join('\n')}

Component Breakdown:
------------------
🟢 Low: ${report.complexityBreakdown.low}
🟡 Medium: ${report.complexityBreakdown.medium}
🔴 High: ${report.complexityBreakdown.high}
    `.trim();
    }

    private async saveReportToFile(filePath: string, content: string, reportType: string): Promise<void> {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        let finalContent = content;
        if (reportType === 'json') {
            finalContent = content;
        }
        await fs.promises.writeFile(filePath, finalContent, 'utf-8');
    }

    // --- НАСТРОЙКА CLI ---
    private setupCLI(): void {
        const program = new Command();

        program
            .name('react-test-agent')
            .description('AI-powered React test generator')
            .version('1.0.0');

        program
            .command('generate <path>')
            .description('Generate tests for React component or directory')
            .option('-f, --framework <type>', 'Test framework', 'jest')
            .option('-l, --library <type>', 'Testing library', 'react-testing-library')
            .option('-t, --types <types>', 'Comma-separated list of test types (unit,integration,e2e,snapshot,visual,performance)')
            .option('-x, --exclude <types>', 'Comma-separated list of test types to exclude')
            .option('--all', 'Generate all test types (override auto-detection)')
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
            .description('Generate enhanced test generation report')
            .option('-o, --output <path>', 'Output file path (optional)')
            .action(async (options) => {
                await this.handleReport({ type: 'enhanced', output: options.output });
            });

        program
            .command('analyze <path>')
            .description('Analyze component without generating tests')
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

        program.parse();
    }

    constructor() {
        this.setupCLI();
    }
}

new TestAgentCLI();