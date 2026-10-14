/**
 * Snapshot-тесты для проверки рендеринга для AddTask
 * 
 * @file AddTask.snapshot.test.tsx
 * @description Тестирование AddTask 
 * @generated 2026-09-08T13:31:22.662Z
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
import AddTask from './AddTask';

describe('AddTask Snapshot Tests', () => {
  describe('Default Props and States', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<AddTask />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('States: Loading', () => {
    test('should match loading state snapshot', () => {
      const tree = renderer.create(<AddTask loading={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('States: Error', () => {
    test('should match error state snapshot', () => {
      const tree = renderer.create(<AddTask error={"An error occurred"} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('States: Data', () => {
    test('should match data state snapshot', () => {
      const tree = renderer.create(<AddTask data={{ name: "Test Task", description: "Test Description" }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Prop Variations', () => {
    test('should match snapshot with different prop variations', () => {
      const tree = renderer.create(<AddTask 
        name="Test Task" 
        description="Test Description" 
        emoji="😊" 
        color="#FF5733" 
        deadline="2023-10-10T12:00:00" 
        categories={[{id: "cat1", name: "Category 1"}, {id: "cat2", name: "Category 2"}]}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});