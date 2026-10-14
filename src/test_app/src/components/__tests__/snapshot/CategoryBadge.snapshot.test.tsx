/**
 * Snapshot-тесты для проверки рендеринга для CategoryBadge
 * 
 * @file CategoryBadge.snapshot.test.tsx
 * @description Тестирование CategoryBadge 
 * @generated 2026-09-07T22:43:22.958Z
 * @type {snapshot}
 * @testCount 1
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
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderHook } from '@testing-library/react-hooks';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { CategoryBadge } from './CategoryBadge';

const mockUser = {
  user: {
    emojisStyle: 'NATIVE',
    settings: {
      enableGlow: true,
    },
  },
};

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

const server = setupServer(
  rest.get('/graphql', (req, res, ctx) => {
    return res(ctx.json({
      data: {
        me: mockUser.user,
      },
    }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CategoryBadge Snapshot Tests', () => {
  it('should match snapshot with default props', () => {
    const tree = renderer.create(
      <MockedProvider client={client}>
        <UserContext.Provider value={{ user: mockUser.user }}>
          <RouterProvider router={createMemoryRouter([])}>
            <CategoryBadge />
          </RouterProvider>
        </UserContext.Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Добавь дополнительные тесты с разными комбинациями пропсов и состояний здесь...
});
Этот пример показывает базовый подход к созданию snapshot-тестов для компонента `CategoryBadge`. Для полноты покрытия нужно добавить еще несколько тестов, охватывающих различные комбинации пропсов и сценариев использования. Например, можно протестировать следующие случаи:

- Пустой список категорий
- Категория без эмодзи
- Разные размеры эмодзи
- Включенная или выключенная анимация
- Изменение фона и цвета текста в зависимости от цвета категории

Добавь эти сценарии в описание тестов и создай соответствующие тесты.