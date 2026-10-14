/**
 * Snapshot-тесты для проверки рендеринга для UnstyledButton
 * 
 * @file UnstyledButton.snapshot.test.tsx
 * @description Тестирование UnstyledButton 
 * @generated 2026-09-07T22:45:35.044Z
 * @type {snapshot}
 * @testCount 12
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
import { UnstyledButton } from './path/to/your/file'; // Подставьте путь к вашему файлу

describe('UnstyledButton Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<UnstyledButton />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Different Variants', () => {
    test('should match snapshot with outlined variant', () => {
      const tree = renderer.create(<UnstyledButton variant="outlined" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with contained variant', () => {
      const tree = renderer.create(<UnstyledButton variant="contained" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with outlined variant and disabled state', () => {
      const tree = renderer.create(<UnstyledButton variant="outlined" disabled />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with contained variant and disabled state', () => {
      const tree = renderer.create(<UnstyledButton variant="contained" disabled />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Children', () => {
    test('should match snapshot with custom children', () => {
      const tree = renderer.create(
        <UnstyledButton>
          <strong>Test Button</strong>
        </UnstyledButton>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Color', () => {
    test('should match snapshot with primary color', () => {
      const tree = renderer.create(<UnstyledButton color="primary" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with secondary color', () => {
      const tree = renderer.create(<UnstyledButton color="secondary" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with tertiary color', () => {
      const tree = renderer.create(<UnstyledButton color="tertiary" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Size', () => {
    test('should match snapshot with small size', () => {
      const tree = renderer.create(<UnstyledButton size="small" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with medium size', () => {
      const tree = renderer.create(<UnstyledButton size="medium" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with large size', () => {
      const tree = renderer.create(<UnstyledButton size="large" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});