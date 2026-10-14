/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для TaskIcon
 * 
 * @file TaskIcon.integration.test.tsx
 * @description Тестирование TaskIcon 
 * @generated 2026-09-08T13:18:58.051Z
 * @type {integration}
 * @testCount 4
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

Вот пример кода интеграционного теста для компонента `TaskIcon` с учетом всех указанных зависимостей и требований:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider as UserContextProvider } from '../contexts/UserContext'; // Предположительно, путь к провайдеру вашего контекста
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import TaskIcon from './TaskIcon'; // Путь к вашему компоненту

// Создаем простой mock-theme
const theme = createTheme({
  palette: {
    primary: '#ff0000',
  },
});

const server = setupServer(
  // Моки для API, если они существуют
  rest.get('/api/tasks', (req, res, ctx) =>
    res(ctx.json({ tasks: [] })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TaskIcon Integration Tests', () => {
  it('renders correctly with default props', async () => {
    render(
      <UserContextProvider>
        <ThemeProvider theme={theme}>
          <TaskIcon />
        </ThemeProvider>
      </UserContextProvider>,
    );

    await waitFor(() => expect(screen.queryByRole('img')).toBeInTheDocument());
  });

  it('renders correctly with custom props', async () => {
    render(
      <UserContextProvider>
        <ThemeProvider theme={theme}>
          <TaskIcon scale={2} color="#00ff00" variant="add" />
        </ThemeProvider>
      </UserContextProvider>,
    );

    await waitFor(() => expect(screen.queryByRole('img')).toBeInTheDocument());
  });

  it('renders correctly when context is provided', async () => {
    const user = {
      settings: {
        enableGlow: true,
      },
    };

    render(
      <UserContextProvider value={{ user }}>
        <ThemeProvider theme={theme}>
          <TaskIcon />
        </ThemeProvider>
      </UserContextProvider>,
    );

    await waitFor(() => expect(screen.queryByRole('img')).toHaveStyleContaining('filter'));
  });

  it('renders correctly when error occurs', async () => {
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => res(ctx.status(500), ctx.json({ message: 'Error' }))),
    );

    render(
      <UserContextProvider>
        <ThemeProvider theme={theme}>
          <TaskIcon />
        </ThemeProvider>
      </UserContextProvider>,
    );

    await waitFor(() => expect(screen.queryByText(/Error/i)).toBeInTheDocument());
  });
});
### Описание шагов:

1. **Настройка MSW**: Используется сервер MSW для мокирования API-запросов.
   
2. **Настройка провайдера контекста**: Компонент `TaskIcon` использует контекст `UserContext`, поэтому мы используем провайдер этого контекста в наших тестах.

3. **Тестирование различных сценариев**:
   - Первый тест проверяет базовое отображение компонента без дополнительных параметров.
   - Второй тест проверяет отображение компонента при передаче собственных пропсов (`scale`, `color`, `variant`).
   - Третий тест проверяет поведение компонента при наличии данных из контекста пользователя.
   - Четвертый тест проверяет реакцию на ошибку API-запроса.

4. **Использование `waitFor`**: Для ожидания завершения рендеринга и проверки элементов DOM используется библиотека `@testing-library/wait-for`.

Этот набор тестов покрывает основные сценарии использования компонента и его взаимодействие с контекстом и API.