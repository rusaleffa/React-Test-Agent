/**
 * Snapshot-тесты для проверки рендеринга для Accordion
 * 
 * @file Accordion.snapshot.test.tsx
 * @description Тестирование Accordion 
 * @generated 2026-09-07T22:12:34.507Z
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
import { Accordion } from './Accordion';

describe('Accordion Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<Accordion />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Data and Checked List', () => {
    const data = [
      { name: 'role1', info: 'info1' },
      { name: 'role2', info: 'info2' },
    ];
    const checkedList = ['role1'];

    test('should match snapshot with data and checked list', () => {
      const tree = renderer.create(
        <Accordion
          title="Test Title"
          data={data}
          checkedList={checkedList}
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Disabled State', () => {
    const data = [
      { name: 'role1', info: 'info1' },
      { name: 'role2', info: 'info2' },
    ];
    const checkedList = [];

    test('should match snapshot in disabled state', () => {
      const tree = renderer.create(
        <Accordion
          title="Test Title"
          disabled
          data={data}
          checkedList={checkedList}
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match snapshot in loading state', () => {
      const tree = renderer.create(<Accordion title="Test Title" loading />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    test('should match snapshot in error state', () => {
      const tree = renderer.create(<Accordion title="Test Title" error />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});