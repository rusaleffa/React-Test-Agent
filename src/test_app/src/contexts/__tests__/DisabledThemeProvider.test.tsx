import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/core/createTheme';
import { isDark } from '../../src/utils';
import DisabledThemeProvider from '../src/contexts/DisabledThemeProvider';

describe('DisabledThemeProvider', () => {
  let mockUseMuiTheme;
  let mockIsDark;
  let mockCreateTheme;

  beforeEach(() => {
    mockUseMuiTheme = jest.fn().mockImplementation(() => ({
      palette: {
        secondary: {
          main: '#ff0000',
        },
      },
    }));
    mockIsDark = jest.fn().mockReturnValue(true);
    mockCreateTheme = jest.fn().mockImplementation((theme) => theme);

    jest.mock('@mui/material/styles', () => ({
      useTheme: mockUseMuiTheme,
      createTheme: mockCreateTheme,
    }));
  });

  it('renders correctly with default props', () => {
    render(
      <DisabledThemeProvider>
        <div data-testid="test-element">Test Content</div>
      </DisabledThemeProvider>,
    );

    expect(screen.getByTestId('test-element')).toBeInTheDocument();
  });

  it('creates a dark theme based on the secondary color', () => {
    render(
      <DisabledThemeProvider>
        <div />
      </DisabledThemeProvider>,
    );

    expect(mockCreateTheme).toHaveBeenCalledWith({
      palette: {
        mode: 'dark',
        primary: {},
        secondary: {
          main: '#ff0000',
        },
      },
    });
  });

  it('does not change the theme if secondary color is light', () => {
    mockIsDark.mockReturnValue(false);

    render(
      <DisabledThemeProvider>
        <div />
      </DisabledThemeProvider>,
    );

    expect(mockCreateTheme).toHaveBeenCalledWith({
      palette: {
        mode: 'light',
        primary: {},
        secondary: {
          main: '#ff0000',
        },
      },
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: Component.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Component
// ============================================
import renderer from 'react-test-renderer';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { isDark } from '../utils';
import DisabledThemeProvider from './DisabledThemeProvider'; // Убедитесь, что путь корректен

// Пример создания простого компонента для тестирования
const TestComponent = () => (
  <DisabledThemeProvider>
    <div>Test Content</div>
  </DisabledThemeProvider>
);

describe('DisabledThemeProvider Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer.create(<TestComponent />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Добавьте дополнительные тесты в зависимости от ваших сценариев и состояний
  // Например, если у вас есть различные комбинации пропсов или состояний
  test('should match snapshot with dark mode prop', () => {
    const tree = renderer.create(
      <TestComponent />
    ).toJSON(); // Здесь можно добавить конкретные пропсы, например: <TestComponent isDarkMode={true} />
    expect(tree).toMatchSnapshot();
  });

  // Продолжайте добавлять тесты для других возможных сценариев и состояний
  // Например, тестирование ошибок или загрузки данных
});
Обратите внимание, что приведенный выше пример является упрощенным шаблоном. Вам нужно будет адаптировать его под реальные сценарии использования вашего компонента `DisabledThemeProvider`, включая добавление различных комбинаций пропсов и состояний, которые вы хотите протестировать.

// ============================================
// INTEGRATION TESTS
// Файл: Component.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Component
// ============================================
Ниже приведён пример кода интеграционного теста для компонента `DisabledThemeProvider` в формате TypeScript с использованием библиотеки MSW для мокирования запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux'; // Предположим, что используется Redux
import { configureStore } from '@reduxjs/toolkit';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { isDark } from '../utils';
import { DisabledThemeProvider } from './DisabledThemeProvider'; // Импортируйте компонент для тестирования

// Создаём сервер для мокирования API-запросов
const server = setupServer(
  rest.get('/api/data', (req, res, ctx) =>
    res(ctx.json({ data: ['item1', 'item2'] }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Конфигурация Redux Store
const store = configureStore({
  reducer: {},
});

// Реализация функции для проверки темного режима
jest.mock('@mui/material/styles', () => ({
  useTheme: jest.fn().mockImplementation(() => ({
    palette: {
      secondary: {
        main: '#ff0000',
      },
    },
  }),
),
}));

describe('DisabledThemeProvider Integration Tests', () => {
  it('should load data and display items in light mode', async () => {
    render(
      <Provider store={store}>
        <DisabledThemeProvider>
          <div>
            <h1>Test</h1>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </DisabledThemeProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/test/i)).toBeInTheDocument());

    // Проверяем отображение элементов списка
    expect(screen.queryByText(/item 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/item 2/i)).toBeInTheDocument();
  });

  it('should handle dark mode correctly', async () => {
    // Изменяем состояние темы на тёмную
    useTheme.mockImplementation(() => ({
      palette: {
        secondary: {
          main: '#0000ff',
        },
      },
    }));

    render(
      <Provider store={store}>
        <DisabledThemeProvider>
          <div>
            <h1>Test</h1>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </DisabledThemeProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/test/i)).toBeInTheDocument());

    // Проверяем отображение элементов списка при тёмной теме
    expect(screen.queryByText(/item 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/item 2/i)).toBeInTheDocument();
  });
});
Этот пример демонстрирует базовый подход к написанию интеграционных тестов для компонента `DisabledThemeProvider`. В нём используются следующие инструменты:

- **MSW** — для мокирования API-запросов.
- **Testing Library** — для выполнения действий пользователя и проверки DOM-элементов.
- **Jest** — для написания самих тестов и их запуска.

Обратите внимание, что в примере предполагается наличие Redux-провайдера (`Provider`), который может быть заменен или дополнен другими провайдерами контекста, если они присутствуют в вашем проекте.
