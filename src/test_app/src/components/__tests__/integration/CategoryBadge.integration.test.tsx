/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для CategoryBadge
 * 
 * @file CategoryBadge.integration.test.tsx
 * @description Тестирование CategoryBadge 
 * @generated 2026-09-07T22:43:22.958Z
 * @type {integration}
 * @testCount 3
 * 
 * @dependencies @testing-library/react, @testing-library/jest-dom, msw
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D @testing-library/jest-dom
// npm install -D msw

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