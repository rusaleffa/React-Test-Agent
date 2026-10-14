// src/core/base-interfaces.ts - исправленная версия
import { Tool, Planner, AgentContext, ExecutionResult, TestPlan } from '../types/agent';

export abstract class BaseTool implements Tool {
    abstract name: string;
    abstract description: string;
    abstract execute(input: any): Promise<any>;

    // ✅ Исправляем сигнатуру метода
    validateInput(input: any, schema?: any): boolean {
        // Базовая валидация
        if (!input) {
            console.warn('⚠️ Input is empty');
            return false;
        }
        return true;
    }
}

export abstract class BasePlanner implements Planner {
    abstract plan(componentCode: string, analysis: any): Promise<any>;

    protected calculateComplexity(analysis: any): string {
        const factors: string[] = [];
        if (analysis.props?.length > 5) factors.push('many_props');
        if (analysis.states?.length > 3) factors.push('many_states');
        if (analysis.effects?.length > 2) factors.push('many_effects');
        if (analysis.dependencies?.length > 5) factors.push('many_dependencies');

        if (factors.length >= 3) return 'high';
        if (factors.length >= 1) return 'medium';
        return 'low';
    }
}