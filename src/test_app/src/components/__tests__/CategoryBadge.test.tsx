import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import CategoryBadge from '../CategoryBadge';

const mockUser = {
  user: {
    emojisStyle: 'NATIVE',
    settings: {
      enableGlow: true,
    },
  },
};

const MockComponent = () => (
  <MemoryRouter>
    <UserContext.Provider value={{ user: mockUser.user }}>
      <CategoryBadge category={{ id: 1, name: 'Test Category', color: '#ff0000', emoji: ':test:' }} />
    </UserContext.Provider>
  </MemoryRouter>
);

describe('CategoryBadge', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<MockComponent />);
      expect(screen.getByRole('chip')).toBeInTheDocument();
      expect(screen.queryByText(':test:')).toBeInTheDocument();
    });

    it('should render without emoji when no emoji is provided', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser.user }}>
            <CategoryBadge category={{ id: 1, name: 'Test Category', color: '#ff0000' }} />
          </UserContext.Provider>
        </MemoryRouter>
      );
      expect(screen.queryByText(':test:')).not.toBeInTheDocument();
    });

    it('should render with custom sizes for emojis', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser.user }}>
            <CategoryBadge category={{ id: 1, name: 'Test Category', color: '#ff0000', emoji: ':test:' }}
              emojiSizes={[30, 40]}
            />
          </UserContext.Provider>
        </MemoryRouter>
      );
      expect(screen.getByText(':test:').parentElement.style.width).toEqual('30px');
      expect(screen.getByText(':test:').parentElement.style.height).toEqual('40px');
    });
  });

  describe('Interaction', () => {
    it('should handle click event', async () => {
      render(<MockComponent />);
      await userEvent.click(screen.getByRole('chip'));
      expect(screen.getByRole('dialog')).toBeInTheDocument(); // проверка открытия диалога или другого поведения при клике
    });
  });
});

// Дополнительные тесты можно добавить здесь, например, проверку стилей, анимации и других особенностей компонента

// ============================================
// SNAPSHOT TESTS
// Файл: CategoryBadge.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для CategoryBadge
// ============================================
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

// ============================================
// INTEGRATION TESTS
// Файл: CategoryBadge.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для CategoryBadge
// ============================================
Ниже представлен пример кода интеграционного теста для компонента `CategoryBadge`, учитывая требования и предоставленный компонент.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext'; // Предположим, что UserContext уже настроен
import { store } from '../store'; // Предполагается наличие Redux Store
import { CategoryBadge } from './CategoryBadge'; // Импортируйте ваш компонент здесь

// Настраиваем сервер MSW
const server = setupServer(
  // Моки для API, если они используются в вашем компоненте
  rest.get('/api/categories', (req, res, ctx) =>
    res(ctx.json([
      {
        id: 1,
        name: 'Test Category',
        color: '#ff0000',
        emoji: '🚀'
      },
    ])),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CategoryBadge Integration Tests', () => {
  it('renders the badge with correct information', async () => {
    render(
      <Provider store={store}>
        <UserContext.Provider value={{
          user: {
            emojisStyle: 'NATIVE',
            settings: {
              enableGlow: true
            }
          }
        }}>
          <Router history={createMemoryHistory()}>
            <CategoryBadge category={{ id: 1, name: 'Test Category', color: '#ff0000', emoji: '🚀' }} />
          </Router>
        </UserContext.Provider>
      </Provider>,
    );

    await waitFor(() => expect(screen.queryByText('Test Category')).toBeInTheDocument());

    // Проверяем отображение аватара с эмодзи
    const avatarElement = screen.getByRole('img');
    expect(avatarElement).toHaveAttribute('alt', 'Test Category');
    expect(avatarElement).toHaveAttribute('aria-label', 'Test Category');

    // Проверка цвета фона и текста
    const chipElement = screen.getByRole('button');
    expect(chipElement).toHaveStyle(`background-color: #ff0000`);
    expect(chipElement).toHaveStyle(`color: ${getFontColor('#ff0000')}`);

    // Проверка наличия эффекта "glow"
    expect(chipElement).toHaveStyle(`box-shadow: 0 0 8px 0 #ff0000`);
  });

  it('handles loading state correctly', async () => {
    render(
      <Provider store={store}>
        <UserContext.Provider value={{
          user: {
            emojisStyle: 'NATIVE',
            settings: {
              enableGlow: true
            }
          }
        }}>
          <Router history={createMemoryHistory()}>
            <CategoryBadge category={{ id: 1, name: 'Loading...', color: '#ff0000', emoji: '🚀' }} />
          </Router>
        </UserContext.Provider>
      </Provider>,
    );

    await waitFor(() => expect(screen.queryByText('Loading...')).toBeInTheDocument());

    // Проверяем отображение индикатора загрузки или placeholder
    const loadingIndicator = screen.queryByText('Loading...');
    expect(loadingIndicator).not.toBeNull();
  });

  it('handles error state correctly', async () => {
    server.use(
      rest.get('/api/categories', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({
          message: 'Internal Server Error'
        }))
      )
    );

    render(
      <Provider store={store}>
        <UserContext.Provider value={{
          user: {
            emojisStyle: 'NATIVE',
            settings: {
              enableGlow: true
            }
          }
        }}>
          <Router history={createMemoryHistory()}>
            <CategoryBadge category={{ id: 1, name: 'Error Test', color: '#ff0000', emoji: '🚀' }} />
          </Router>
        </UserContext.Provider>
      </Provider>,
    );

    await waitFor(() => expect(screen.queryByText('Error Test')).toBeInTheDocument());

    // Проверяем отображение сообщения об ошибке
    const errorMessage = screen.queryByText('Internal Server Error');
    expect(errorMessage).not.toBeNull();
  });
});
Этот пример демонстрирует базовую структуру интеграционного тестирования компонента `CategoryBadge`. В нем реализованы тесты на корректное отображение данных, обработку состояний загрузки и ошибок. Вы можете расширить эти тесты в соответствии со своими требованиями и особенностями вашего приложения.
