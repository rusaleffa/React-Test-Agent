// Setup file for ArrowSwitch unit tests
import '@testing-library/jest-dom';

// Глобальные моки (например, для matchMedia)
global.matchMedia = global.matchMedia || function() {
    return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
    };
};

// Здесь можно добавить моки для внешних зависимостей
// jest.mock('some-module', () => ({ ... }));
