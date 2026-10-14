/**
 * Snapshot-тесты для проверки рендеринга для reduceMotion
 * 
 * @file reduceMotion.snapshot.test.tsx
 * @description Тестирование reduceMotion 
 * @generated 2026-09-08T13:38:55.891Z
 * @type {snapshot}
 * @testCount 5
 * 
 * @dependencies @testing-library/react, react-test-renderer
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D react-test-renderer

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