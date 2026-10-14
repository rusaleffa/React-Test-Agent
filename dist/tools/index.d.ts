import { Tool, ComponentAnalysis, LLMProvider } from '../types/agent';
import { BaseTool } from '../core/base-interfaces';
export declare class ComponentAnalyzerTool extends BaseTool implements Tool {
    private llm;
    name: string;
    description: string;
    constructor(llm: LLMProvider);
    execute(input: {
        code: string;
        componentPath: string;
    }): Promise<ComponentAnalysis>;
}
export declare class TestGeneratorTool extends BaseTool implements Tool {
    private llm;
    name: string;
    description: string;
    constructor(llm: LLMProvider);
    execute(input: {
        componentCode: string;
        analysis: ComponentAnalysis;
        framework: string;
    }): Promise<{
        testCases: string[];
        testCode: string;
    }>;
}
