import { AgentContext, ExecutionResult, TestPlan } from "../../types/agent";
export interface LLMProvider {
    generate(prompt: string, context?: string): Promise<string>;
    generateStructured<T>(prompt: string, schema: any): Promise<T>;
    analyze(code: string, context: string): Promise<any>;
}
export interface Tool {
    name: string;
    description: string;
    execute(input: any): Promise<any>;
}
export interface Planner {
    plan(componentCode: string, context: AgentContext): Promise<TestPlan>;
}
export interface Executor {
    execute(plan: TestPlan, context: AgentContext): Promise<ExecutionResult>;
}
