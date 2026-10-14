/**
 * Snapshot-тесты для проверки рендеринга для TaskIcon
 * 
 * @file TaskIcon.snapshot.test.tsx
 * @description Тестирование TaskIcon 
 * @generated 2026-09-08T13:18:58.050Z
 * @type {snapshot}
 * @testCount 8
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

describe('TaskIcon Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<TaskIcon />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error Icon', () => {
    test('should match snapshot with error prop', () => {
      const tree = renderer.create(<TaskIcon variant="error" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Add Icon', () => {
    test('should match snapshot with add prop', () => {
      const tree = renderer.create(<TaskIcon variant="add" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Success Icon', () => {
    test('should match snapshot with success prop', () => {
      const tree = renderer.create(<TaskIcon variant="success" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Custom Color', () => {
    test('should match snapshot with custom color', () => {
      const tree = renderer.create(<TaskIcon color="#ff0000" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Scale Prop', () => {
    test('should match snapshot with scale prop', () => {
      const tree = renderer.create(<TaskIcon scale={0.5} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('User Context Settings', () => {
    test('should match snapshot with glow enabled', () => {
      const contextValue = {
        user: {
          settings: {
            enableGlow: true,
          },
        },
      };
      const tree = renderer.create(
        <UserContext.Provider value={{ user: contextValue.user }}>
          <TaskIcon />
        </UserContext.Provider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with glow disabled', () => {
      const contextValue = {
        user: {
          settings: {
            enableGlow: false,
          },
        },
      };
      const tree = renderer.create(
        <UserContext.Provider value={{ user: contextValue.user }}>
          <TaskIcon />
        </UserContext.Provider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});