/**
 * Snapshot-тесты для проверки рендеринга для BottomNav
 * 
 * @file BottomNav.snapshot.test.tsx
 * @description Тестирование BottomNav 
 * @generated 2026-09-07T22:43:01.036Z
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
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MockUser } from '../__mocks__/MockUser';

// Mocking API calls and routes
const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json(MockUser));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('BottomNav Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: MockUser }}>
        <RouterProvider router={createMemoryRouter([])}>
          <BottomNav />
        </RouterProvider>
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when no tasks are present', () => {
    const mockUserWithoutTasks = {
      ...MockUser,
      tasks: []
    };
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUserWithoutTasks }}>
        <RouterProvider router={createMemoryRouter([])}>
          <BottomNav />
        </RouterProvider>
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when there are tasks but all done', () => {
    const mockUserWithDoneTasks = {
      ...MockUser,
      tasks: [
        { id: 1, name: 'Task 1', done: true },
        { id: 2, name: 'Task 2', done: true }
      ]
    };
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUserWithDoneTasks }}>
        <RouterProvider router={createMemoryRouter([])}>
          <BottomNav />
        </RouterProvider>
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when error occurs', () => {
    const mockErrorUser = {
      ...MockUser,
      error: 'An error occurred'
    };
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockErrorUser }}>
        <RouterProvider router={createMemoryRouter([])}>
          <BottomNav />
        </RouterProvider>
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});