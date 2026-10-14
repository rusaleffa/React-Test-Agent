import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CustomToaster from '../CustomToaster';
import { ThemeProvider } from '@emotion/react';
import { UserContext } from '../contexts/UserContext';
import { createUserContext } from '../__mocks__/UserContext.mock';

describe('CustomToaster', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = createUserContext();
  });

  describe('Рендеринг', () => {
    it('should render without crashing', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <ThemeProvider>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      );
      expect(screen.queryByTestId('toast')).not.toBeNull();
    });

    it('should render with custom styles based on dark mode', () => {
      const theme = {
        darkmode: true,
        primary: '#ff0000',
        secondary: '#ffffff'
      };
      render(
        <UserContext.Provider value={{ settings: { reduceMotion: false }, user }}>
          <ThemeProvider theme={theme}>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      );
      const toasterElement = screen.getByRole('alert');
      expect(toasterElement).toHaveStyle({
        background: '#141431e0',
        color: '#ffffff'
      });
    });

    it('should render with reduced motion styles when reduceMotion is true', () => {
      const theme = {
        darkmode: false,
        primary: '#ff0000',
        secondary: '#ffffff'
      };
      render(
        <UserContext.Provider value={{ settings: { reduceMotion: true }, user }}>
          <ThemeProvider theme={theme}>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      );
      const toasterElement = screen.getByRole('alert');
      expect(toasterElement).toHaveStyle({
        animation: 'none'
      });
    });
  });

  describe('Interaction', () => {
    it('should handle click event', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <ThemeProvider>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      );
      userEvent.click(screen.getByRole('alert'));
      expect(screen.getByRole('alert')).toHaveAttribute('aria-activedescendant');
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: CustomToaster.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для CustomToaster
// ============================================
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@emotion/react';
import { UserContext } from '../contexts/UserContext';
import { createUserContext } from '../__mocks__/UserContext.mock';
import { Theme } from '../theme/themeConfig';

// Mocking the UserContext for testing purposes
const mockUserContext = createUserContext({ settings: { reduceMotion: false } });

describe('CustomToaster Snapshot Tests', () => {
  // Test with default props and no context
  test('should match snapshot with default props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={Theme}>
          <UserContext.Provider value={mockUserContext}>
            <CustomToaster />
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Test with reduced motion enabled in context
  test('should match snapshot with reduced motion enabled', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={Theme}>
          <UserContext.Provider value={createUserContext({ settings: { reduceMotion: true } })}>
            <CustomToaster />
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Test with mobile layout
  test('should match snapshot on mobile layout', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={Theme}>
          <UserContext.Provider value={mockUserContext}>
            <CustomToaster />
          </UserContext.Provider>
        </ThemeProvider>,
        { createNodeMock: () => ({ offsetWidth: 320 }) }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: CustomToaster.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для CustomToaster
// ============================================
Ниже приведён пример кода интеграционного теста для компонента `CustomToaster` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomToaster } from './CustomToaster'; // импортируйте компонент здесь
import { UserContext } from '../contexts/UserContext'; // импортируйте UserContext если необходимо
import { ThemeProvider } from '@emotion/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

// создайте сервер моков
const server = setupServer(
  // добавьте моки API здесь
  rest.get('/api/some-endpoint', (req, res, ctx) =>
    res(ctx.json({ someData: 'test' })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CustomToaster Integration Tests', () => {
  it('should show a toaster with correct content when fetching data', async () => {
    render(
      <Router history={createMemoryHistory()}>
        <UserContext.Provider value={{ settings: { reduceMotion: false } }}>
          <ThemeProvider>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      </Router>,
    );

    await waitFor(() => expect(screen.queryByText(/someData/i)).toBeInTheDocument());

    // проверьте отображение сообщения в тостере
    expect(screen.getByText(/someData/i)).toBeInTheDocument();
  });

  it('should handle reduced motion setting correctly', async () => {
    render(
      <Router history={createMemoryHistory()}>
        <UserContext.Provider value={{ settings: { reduceMotion: true } }}>
          <ThemeProvider>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      </Router>,
    );

    await waitFor(() => expect(screen.queryByText(/someData/i)).toBeInTheDocument());

    // убедитесь, что анимация отсутствует при включенной опции "reduceMotion"
    expect(screen.queryByRole('alert')).not.toHaveClass('animated');
  });

  it('should handle errors properly', async () => {
    server.use(
      rest.get('/api/error-endpoint', (req, res, ctx) =>
        res(ctx.status(400), ctx.json({ message: 'error occurred' })),
      ),
    );

    render(
      <Router history={createMemoryHistory()}>
        <UserContext.Provider value={{ settings: { reduceMotion: false } }}>
          <ThemeProvider>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      </Router>,
    );

    await waitFor(() => expect(screen.queryByText(/error occurred/i)).toBeInTheDocument());

    // проверьте сообщение об ошибке
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });
});
### Примечания к тестам:
- **Настройка MSW**: Создаётся сервер моков для имитации сетевых запросов.
- **Тестирование API вызовов**: Добавьте дополнительные моки для проверки различных сценариев работы API.
- **Проверка состояний загрузки и ошибок**: Используйте `waitFor` для ожидания появления сообщений или ошибок в тостере.
- **Асинхронные операции**: Убедитесь, что тесты корректно обрабатывают асинхронность и проверяют состояние UI после завершения операций.

Этот шаблон можно адаптировать под конкретные требования вашего приложения и добавить необходимые проверки и сценарии тестирования.
