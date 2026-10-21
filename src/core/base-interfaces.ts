import { Tool, Planner, TestPlan } from '../types/agent';

// Базовый класс для всех инструментов агента
export abstract class BaseTool implements Tool {
    abstract name: string;
    abstract description: string;
    abstract execute(input: any): Promise<any>;

    // Базовая валидация — отбрасывает пустой payload.
    // Инструменты с более строгими требованиями должны переопределять этот метод.
    validateInput(input: any, _schema?: any): boolean {
        if (!input) {
            console.warn('⚠️ Входные данные пусты');
            return false;
        }
        return true;
    }
}

// Базовый класс для стратегий планирования
export abstract class BasePlanner implements Planner {
    abstract plan(componentCode: string, analysis: any): Promise<TestPlan>;

    // Простая эвристика для оценки сложности — используется наследниками
    protected calculateComplexity(analysis: any): 'low' | 'medium' | 'high' {
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