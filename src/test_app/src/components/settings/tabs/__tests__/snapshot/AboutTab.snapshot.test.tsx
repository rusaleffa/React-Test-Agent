/**
 * Snapshot-тесты для проверки рендеринга для AboutTab
 * 
 * @file AboutTab.snapshot.test.tsx
 * @description Тестирование AboutTab 
 * @generated 2026-09-08T13:21:43.582Z
 * @type {snapshot}
 * @testCount 4
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
import AboutTab from './AboutTab';

const createTreeWithProps = (props) =>
  renderer.create(<AboutTab {...props} />).toJSON();

describe('AboutTab Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = createTreeWithProps({});
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Storage Usage', () => {
    test('should match snapshot when storage usage is present', () => {
      const tree = createTreeWithProps({
        storageUsage: 1024 * 1024,
      });
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Without Storage Usage', () => {
    test('should match snapshot when storage usage is not present', () => {
      const tree = createTreeWithProps({
        storageUsage: null,
      });
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error Scenario', () => {
    test('should match snapshot when there is an error', () => {
      const tree = createTreeWithProps({
        storageUsage: undefined,
      });
      expect(tree).toMatchSnapshot();
    });
  });
});