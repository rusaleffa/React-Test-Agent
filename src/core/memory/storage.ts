// src/core/memory/storage.ts
import {AgentMemory, ComponentAnalysisWithMemory} from '../../types/agent';
import fs from 'fs';
import path from 'path';

export interface MemoryStorage {
    save(memory: AgentMemory): Promise<void>; // Принимает AgentMemory, а не сериализованный объект
    load(): Promise<AgentMemory>;
    backup(): Promise<void>;
}

export class FileSystemStorage implements MemoryStorage {
    private readonly memoryPath = '.agent/memory.json';
    private readonly backupsPath = '.agent/backups';

    async save(memory: AgentMemory): Promise<void> {
        const dir = path.dirname(this.memoryPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Создаем полностью сериализуемый объект
        const serializableMemory = {
            ...memory,
            testHistory: memory.testHistory.map(exec => ({
                ...exec,
                timestamp: exec.timestamp.toISOString() // Конвертируем Date в string
            })),
            componentAnalysis: Array.from(memory.componentAnalysis.entries()), // Конвертируем Map в массив
            commonPatterns: memory.commonPatterns,
            errorPatterns: memory.errorPatterns,
            patterns: memory.patterns,
            performance: memory.performance,
            projectContext: memory.projectContext,
            cache: memory.cache ? {
                componentAnalysis: Array.from(memory.cache.componentAnalysis.entries()),
                testPatterns: Array.from(memory.cache.testPatterns.entries()),
                errorPatterns: Array.from(memory.cache.errorPatterns.entries())
            } : undefined
        };

        await fs.promises.writeFile(
            this.memoryPath,
            JSON.stringify(serializableMemory, null, 2)
        );
    }

    async load(): Promise<AgentMemory> {
        try {
            if (!fs.existsSync(this.memoryPath)) {
                return this.getDefaultMemory();
            }

            const data = await fs.promises.readFile(this.memoryPath, 'utf-8');
            const parsed = JSON.parse(data);

            // Восстанавливаем сложные структуры данных
            return {
                ...parsed,
                testHistory: parsed.testHistory.map((exec: any) => ({
                    ...exec,
                    timestamp: new Date(exec.timestamp) // Восстанавливаем Date из string
                })),
                componentAnalysis: new Map(parsed.componentAnalysis || []), // Восстанавливаем Map из массива
                commonPatterns: parsed.commonPatterns || [],
                errorPatterns: parsed.errorPatterns || [],
                patterns: parsed.patterns || {
                    testPatterns: [],
                    errorPatterns: [],
                    bestPractices: [],
                    antiPatterns: []
                },
                performance: parsed.performance || {
                    averageGenerationTime: 0,
                    successRate: 0,
                    coverageTrend: [],
                    componentComplexityCorrelation: {},
                    toolUsage: {}
                },
                projectContext: parsed.projectContext || {
                    techStack: [],
                    testingPreferences: {},
                    commonPatterns: []
                },
                cache: parsed.cache ? {
                    componentAnalysis: new Map(parsed.cache.componentAnalysis || []),
                    testPatterns: new Map(parsed.cache.testPatterns || []),
                    errorPatterns: new Map(parsed.cache.errorPatterns || [])
                } : {
                    componentAnalysis: new Map(),
                    testPatterns: new Map(),
                    errorPatterns: new Map()
                }
            };
        } catch (error) {
            console.warn('Failed to load memory, using default:', error);
            return this.getDefaultMemory();
        }
    }

    async backup(): Promise<void> {
        if (!fs.existsSync(this.memoryPath)) return;

        const backupDir = this.backupsPath;
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const backupFile = path.join(
            backupDir,
            `memory-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
        );

        await fs.promises.copyFile(this.memoryPath, backupFile);
    }

    private getDefaultMemory(): AgentMemory {
        return {
            testHistory: [],
            componentAnalysis: new Map(),
            commonPatterns: [],
            errorPatterns: [],
            patterns: {
                testPatterns: [],
                errorPatterns: [],
                bestPractices: [],
                antiPatterns: []
            },
            performance: {
                averageGenerationTime: 0,
                successRate: 0,
                coverageTrend: [],
                componentComplexityCorrelation: {},
                toolUsage: {}
            },
            projectContext: {
                techStack: [],
                testingPreferences: {},
                commonPatterns: []
            },
            cache: {
                componentAnalysis: new Map(),
                testPatterns: new Map(),
                errorPatterns: new Map()
            }
        };
    }
}