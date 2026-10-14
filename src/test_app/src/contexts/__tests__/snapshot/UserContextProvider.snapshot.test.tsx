/**
 * Snapshot-тесты для проверки рендеринга для UserContextProvider
 * 
 * @file UserContextProvider.snapshot.test.tsx
 * @description Тестирование UserContextProvider 
 * @generated 2026-09-08T13:30:17.252Z
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
import { UserContextProvider } from './UserContextProvider';

describe('UserContextProvider Snapshot Tests', () => {
  // Тест без пропсов и начального значения state
  test('should match snapshot without props and initial state', () => {
    const tree = renderer.create(<UserContextProvider />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с пропсом children
  test('should match snapshot with children prop', () => {
    const tree = renderer.create(
      <UserContextProvider>
        <div>Test Child</div>
      </UserContextProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с пропсами и измененным состоянием user
  test('should match snapshot when user is updated', () => {
    const newUser = { id: 1, name: 'John Doe' };
    const tree = renderer.create(
      <UserContextProvider>
        <UserContext.Provider value={{ user: newUser, setUser: jest.fn() }}>
          <div>Test Child</div>
        </UserContext.Provider>
      </UserContextProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});