/**
 * Snapshot-тесты для проверки рендеринга для ArrowSwitch
 * 
 * @file ArrowSwitch.snapshot.test.tsx
 * @description Тестирование ArrowSwitch 
 * @generated 2026-09-07T22:12:54.157Z
 * @type {snapshot}
 * @testCount 3
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
import { ArrowSwitch } from './ArrowSwitch'; // импортируйте корректный путь к вашему компоненту

describe('ArrowSwitch Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<ArrowSwitch />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Checked State', () => {
    test('checked state should match snapshot', () => {
      const tree = renderer.create(<ArrowSwitch checked={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Unchecked State', () => {
    test('unchecked state should match snapshot', () => {
      const tree = renderer.create(<ArrowSwitch checked={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});