/**
 * Snapshot-тесты для проверки рендеринга для ColorPicker
 * 
 * @file ColorPicker.snapshot.test.tsx
 * @description Тестирование ColorPicker 
 * @generated 2026-09-07T22:44:28.507Z
 * @type {snapshot}
 * @testCount 13
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
import { ColorPicker } from './ColorPicker'; // импортируйте компонент здесь

describe('ColorPicker Snapshot Tests', () => {
  describe('Basic Rendering Scenarios', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<ColorPicker />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with custom color', () => {
      const tree = renderer.create(<ColorPicker color="#FF0000" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with custom width', () => {
      const tree = renderer.create(<ColorPicker width="200px" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with custom font color', () => {
      const tree = renderer.create(<ColorPicker fontColor="#00FFFF" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with custom label', () => {
      const tree = renderer.create(<ColorPicker label="My Label" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Accordion Expanded State', () => {
    test('should match snapshot with accordion expanded', () => {
      const tree = renderer.create(<ColorPicker accordionExpanded={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Popover Open States', () => {
    test('should match snapshot with first popover open', () => {
      const tree = renderer.create(<ColorPicker popoverOpen={[true, false]} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with second popover open', () => {
      const tree = renderer.create(<ColorPicker popoverOpen=[false, true] />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with both popovers open', () => {
      const tree = renderer.create(<ColorPicker popoverOpen=[true, true] />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Add Dialog Open State', () => {
    test('should match snapshot with add dialog open', () => {
      const tree = renderer.create(<ColorPicker openAddDialog={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Accordion and Popover Combined States', () => {
    test('should match snapshot with accordion expanded and first popover open', () => {
      const tree = renderer.create(
        <ColorPicker accordionExpanded={true} popoverOpen={[true, false]} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with accordion expanded and second popover open', () => {
      const tree = renderer.create(
        <ColorPicker accordionExpanded={true} popoverOpen=[false, true] />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with accordion expanded and both popovers open', () => {
      const tree = renderer.create(
        <ColorPicker accordionExpanded={true} popoverOpen=[true, true] />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});