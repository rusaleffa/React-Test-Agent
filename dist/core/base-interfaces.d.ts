import { Tool, Planner } from '../types/agent';
export declare abstract class BaseTool implements Tool {
    abstract name: string;
    abstract description: string;
    abstract execute(input: any): Promise<any>;
    validateInput(input: any, schema: any): boolean;
}
export declare abstract class BasePlanner implements Planner {
    abstract plan(componentCode: string, analysis: any): Promise<any>;
    protected calculateComplexity(analysis: any): string;
}
