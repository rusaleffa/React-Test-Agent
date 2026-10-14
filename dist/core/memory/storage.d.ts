import { AgentMemory } from '../../types/agent';
export interface MemoryStorage {
    save(memory: AgentMemory): Promise<void>;
    load(): Promise<AgentMemory>;
    backup(): Promise<void>;
}
export declare class FileSystemStorage implements MemoryStorage {
    private readonly memoryPath;
    private readonly backupsPath;
    save(memory: AgentMemory): Promise<void>;
    load(): Promise<AgentMemory>;
    backup(): Promise<void>;
    private getDefaultMemory;
}
