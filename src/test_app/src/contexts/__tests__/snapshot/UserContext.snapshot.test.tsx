/**
 * Snapshot-тесты для проверки рендеринга для UserContext
 * 
 * @file UserContext.snapshot.test.tsx
 * @description Тестирование UserContext 
 * @generated 2026-09-08T13:30:09.853Z
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
import { UserContext } from './UserContext'; // Импортируйте корректный путь к вашему компоненту

const defaultUser = { id: 1, name: 'John Doe' };

// Тест с пустыми пропсами и состоянием по умолчанию
test('should match snapshot with empty props and default state', () => {
  const tree = renderer.create(
    <UserContext>
      <div>Content</div>
    </UserContext>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Тест с заданными пользователем данными и функцией обновления
test('should match snapshot with custom user and setUser function', () => {
  const user = { id: 2, name: 'Jane Smith' };
  const setUserMock = jest.fn();
  const tree = renderer.create(
    <UserContext.Provider value={{ user, setUser: setUserMock }}>
      <div>Content</div>
    </UserContext.Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Тест с ошибкой в состоянии
test('should match snapshot when in error state', () => {
  const errorMessage = 'Error fetching user data';
  const tree = renderer.create(
    <UserContext.Provider value={{ user: null, setUser: () => {}, error: errorMessage }}>
      <div>Content</div>
    </UserContext.Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Тест со статусом загрузки данных
test('should match snapshot when loading', () => {
  const tree = renderer.create(
    <UserContext.Provider value={{ user: null, setUser: () => {}, isLoading: true }}>
      <div>Content</div>
    </UserContext.Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});