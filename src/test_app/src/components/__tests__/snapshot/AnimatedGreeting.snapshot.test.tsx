/**
 * Snapshot-тесты для проверки рендеринга для AnimatedGreeting
 * 
 * @file AnimatedGreeting.snapshot.test.tsx
 * @description Тестирование AnimatedGreeting 
 * @generated 2026-09-07T22:42:37.386Z
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
import { UserContext } from '../contexts/UserContext';  
import { AnimatedGreeting } from './AnimatedGreeting';

// Mock context provider for testing
const mockUserContext = {
  user: {
    emojisStyle: {},
  },
};

describe('AnimatedGreeting Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer.create(
      <UserContext.Provider value={mockUserContext}>
        <AnimatedGreeting />
      </UserContext.Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when greeting is loading', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ ...mockUserContext, user: { ...mockUserContext.user, isLoading: true } }}>
        <AnimatedGreeting />
      </UserContext.Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when greeting has error', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ ...mockUserContext, user: { ...mockUserContext.user, hasError: true } }}>
        <AnimatedGreeting />
      </UserContext.Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when no emojis are available', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          emojisStyle: undefined,
        },
      }}
      >
        <AnimatedGreeting />
      </UserContext.Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});