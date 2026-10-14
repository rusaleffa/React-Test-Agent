/**
 * Snapshot-тесты для проверки рендеринга для Component
 * 
 * @file Component.snapshot.test.tsx
 * @description Тестирование Component 
 * @generated 2026-09-08T13:32:47.860Z
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
import NotFound from './NotFound';

describe('NotFound Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<NotFound />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Custom Message', () => {
    test('should match snapshot with custom message prop', () => {
      const tree = renderer.create(
        <NotFound message={<span>Custom error message</span>} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Long Path Name', () => {
    test('should match snapshot with long path name', () => {
      const tree = renderer.create(
        <NotFound message={"Page /very/long/path/to/page/was/not/found"} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});