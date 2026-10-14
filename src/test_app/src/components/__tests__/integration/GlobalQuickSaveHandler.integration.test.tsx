/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для GlobalQuickSaveHandler
 * 
 * @file GlobalQuickSaveHandler.integration.test.tsx
 * @description Тестирование GlobalQuickSaveHandler 
 * @generated 2026-09-07T22:45:55.418Z
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

Вот пример кода интеграционного теста для компонента `GlobalQuickSaveHandler`:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlobalQuickSaveHandler } from './GlobalQuickSaveHandler'; // импортируйте компонент здесь
import { UserContext } from '../contexts/UserContext'; // импортируйте UserContext если он используется в компоненте
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

// создайте сервер моков
const server = setupServer(
  // моки для API или других зависимостей
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.json({ tasks: [] }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// создайте тему для тестирования
const theme = createTheme({
  palette: {
    type: 'light',
  },
});

describe('GlobalQuickSaveHandler Integration Tests', () => {
  it('should trigger the quick save dialog when pressing Ctrl+S', async () => {
    render(
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user: { tasks: [], darkmode: 'light' } }}>
          <GlobalQuickSaveHandler>
            <div>Children content here</div>
          </GlobalQuickSaveHandler>
        </UserContext.Provider>
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.queryByText(/quick save/i)).toBeInTheDocument());

    userEvent.keyboard('{Ctrl}S');

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeInTheDocument());

    // проверьте содержимое диалога
    expect(screen.getByText(/save your current tasks instantly/i)).toBeInTheDocument();
    expect(screen.getByText(/export all current tasks as a json file?/i)).toBeInTheDocument();

    // нажмите кнопку сохранения
    userEvent.click(screen.getByText(/Save Alt Rounded/i));

    // проверьте успешное завершение операции
    expect(screen.queryByText(/quick save/i)).not.toBeInTheDocument();
  });

  it('should not trigger the quick save dialog when pressing other keys', async () => {
    render(
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user: { tasks: [], darkmode: 'light' } }}>
          <GlobalQuickSaveHandler>
            <div>Children content here</div>
          </GlobalQuickSaveHandler>
        </UserContext.Provider>
      </ThemeProvider>,
    );

    userEvent.keyboard('{Shift}C');

    await waitFor(() => expect(screen.queryByText(/quick save/i)).not.toBeInTheDocument());
  });

  it('should change dark mode when pressing Ctrl+Shift+L', async () => {
    render(
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user: { tasks: [], darkmode: 'light' } }}>
          <GlobalQuickSaveHandler>
            <div>Children content here</div>
          </GlobalQuickSaveHandler>
        </UserContext.Provider>
      </ThemeProvider>,
    );

    userEvent.keyboard('{Ctrl}{Shift}L');

    await waitFor(() => expect(screen.queryByText(/quick save/i)).not.toBeInTheDocument());

    // проверьте изменение режима темной темы
    expect(screen.getByText(/dark mode changed/i)).toBeInTheDocument();
  });
});
Этот тестовый сценарий проверяет следующие аспекты:

- Вызов диалогового окна при нажатии комбинации клавиш `Ctrl+S`.
- Отсутствие вызова диалогового окна при нажатии другой клавиши (`Shift+C`).
- Переключение между светлой и темной темой при нажатии комбинации клавиш `Ctrl+Shift+L`.