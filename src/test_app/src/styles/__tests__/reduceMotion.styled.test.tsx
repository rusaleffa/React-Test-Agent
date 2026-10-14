import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import reduceMotion from '../reduceMotion';

describe('reduceMotion', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<reduceMotion />);
      expect(screen.queryByRole('presentation')).toBeInTheDocument();
    });

    it('should not render when reduceMotion is off', () => {
      const mockTheme = { reduceMotion: 'off' };
      render(<reduceMotion theme={mockTheme} />);
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });

    it('should apply disableStyles when reduceMotion is on', () => {
      const mockTheme = { reduceMotion: 'on' };
      render(<reduceMotion theme={mockTheme} />);
      expect(screen.queryByRole('presentation')).toHaveStyle(
        'animation: none !important; transition: none !important;',
      );
    });

    it('should use media query for prefers-reduced-motion: reduce', () => {
      const mockTheme = { reduceMotion: 'auto' };
      render(<reduceMotion theme={mockTheme} />);
      expect(screen.queryByRole('presentation')).toHaveStyle(
        '@media (prefers-reduced-motion: reduce) {',
      );
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: reduceMotion.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для reduceMotion
// ============================================
import renderer from 'react-test-renderer';
import { reduceMotion } from '../path/to/your/file'; // Замените на реальный путь к файлу

describe('reduceMotion Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<reduceMotion />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Options', () => {
    test('should match snapshot with custom options', () => {
      const tree = renderer.create(
        <reduceMotion options={{ opacity: 0.5 }} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Theme Reduce Motion Off', () => {
    test('should match snapshot when theme reduce motion off', () => {
      const tree = renderer.create(<reduceMotion theme={{ reduceMotion: 'off' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Theme Reduce Motion On', () => {
    test('should match snapshot when theme reduce motion on', () => {
      const tree = renderer.create(<reduceMotion theme={{ reduceMotion: 'on' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Media Query', () => {
    test('should match snapshot in media query', () => {
      const tree = renderer.create(
        <div>
          <reduceMotion />
        </div>,
        {
          createNodeMock: () => document.createElement('div'),
          createTextMock: () => document.createTextNode(''),
          context: {
            prefersReducedMotion: 'reduce',
          },
        }
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
Замените `/path/to/your/file` на правильный путь до вашего файла с компонентом `reduceMotion`.

// ============================================
// INTEGRATION TESTS
// Файл: reduceMotion.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для reduceMotion
// ============================================
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
