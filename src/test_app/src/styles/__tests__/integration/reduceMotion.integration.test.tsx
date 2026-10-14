/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для reduceMotion
 * 
 * @file reduceMotion.integration.test.tsx
 * @description Тестирование reduceMotion 
 * @generated 2026-09-08T13:38:55.891Z
 * @type {integration}
 * @testCount 0
 * 
 * @dependencies @testing-library/react, @testing-library/jest-dom, msw
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D @testing-library/jest-dom
// npm install -D msw

Ниже приведён пример кода интеграционного теста компонента `reduceMotion` без использования внешнего API или Redux контекста, так как в предоставленном компоненте отсутствуют такие зависимости:

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'emotion-theming';
import { createTheme } from '@emotion/theming';
import { reduceMotion } from './reduceMotion'; // импортируйте ваш компонент здесь

// Создайте тему с различными значениями reduceMotion
const themes = [
  createTheme({ reduceMotion: 'off' }),
  createTheme({ reduceMotion: 'on' }),
];

describe('reduceMotion Integration Tests', () => {
  test.each(themes)('should apply correct styles based on reduceMotion value %s', (theme) => {
    const container = document.createElement('div');
    const serializedStyles = reduceMotion(theme);

    // Проверьте наличие стилей, если reduceMotion не равно off
    expect(serializedStyles).toBeDefined();

    // Примените стили к контейнеру
    container.style.cssText = serializedStyles?.toString() || '';

    // Используйте пользовательское событие для имитации взаимодействия пользователя
    userEvent.click(container);

    // Проверьте, что анимация отключена
    expect(getComputedStyle(container).getPropertyValue('animation')).toEqual('none !important');
    expect(getComputedStyle(container).getPropertyValue('transition')).toEqual('none !important');
  });
});
Этот тест проверяет корректность применения стилей на основе значения свойства `reduceMotion`. Обратите внимание, что тест использует встроенные методы браузера (`getComputedStyle`) для проверки того, что анимация и переходы действительно отключены.