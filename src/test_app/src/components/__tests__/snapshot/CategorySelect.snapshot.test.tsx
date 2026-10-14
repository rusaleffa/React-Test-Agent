/**
 * Snapshot-тесты для проверки рендеринга для CategorySelect
 * 
 * @file CategorySelect.snapshot.test.tsx
 * @description Тестирование CategorySelect 
 * @generated 2026-09-07T22:44:01.657Z
 * @type {snapshot}
 * @testCount 7
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
import { CategorySelect } from './CategorySelect';

describe('CategorySelect Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<CategorySelect />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Selected Categories', () => {
    const selectedCategories = [
      { id: '1', name: 'Test Category 1', color: '#ff0000' },
      { id: '2', name: 'Test Category 2', color: '#00ff00' },
    ];

    test('should match snapshot with selected categories', () => {
      const tree = renderer.create(
        <CategorySelect selectedCategories={selectedCategories} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Empty Selected Categories', () => {
    test('should match snapshot with empty selected categories', () => {
      const tree = renderer.create(<CategorySelect selectedCategories=[] />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Custom Width', () => {
    test('should match snapshot with custom width prop', () => {
      const tree = renderer.create(
        <CategorySelect width={'300px'} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Font Color Prop', () => {
    test('should match snapshot with font color prop', () => {
      const tree = renderer.create(
        <CategorySelect fontColor={'#000000'} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Favorite Categories', () => {
    const favoriteCategories = ['1'];
    const categories = [
      { id: '1', name: 'Test Category 1', color: '#ff0000', emoji: '🌿' },
      { id: '2', name: 'Test Category 2', color: '#00ff00', emoji: '💚' },
    ];

    test('should match snapshot with favorite categories', () => {
      const tree = renderer.create(
        <CategorySelect
          selectedCategories={[categories[0]]}
          categories={categories}
          favoriteCategories={favoriteCategories}
        />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Maximum Categories', () => {
    const selectedCategories = [
      { id: '1', name: 'Test Category 1', color: '#ff0000' },
      { id: '2', name: 'Test Category 2', color: '#00ff00' },
      { id: '3', name: 'Test Category 3', color: '#0000ff' },
    ];

    test('should match snapshot when maximum number of categories reached', () => {
      const tree = renderer.create(
        <CategorySelect
          selectedCategories={selectedCategories}
          onCategoryChange={() => {}}
        />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});