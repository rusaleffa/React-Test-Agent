import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GlobalStyles from './GlobalStyles';  

describe('GlobalStyles', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<GlobalStyles />);
      
      expect(screen.queryAllByRole('global')).toHaveLength(1); // Проверяем наличие глобального элемента
    });
    
    it('should apply custom styles based on theme and settings', () => {
      const mockUser = {
        settings: {
          reduceMotion: 'system'
        }
      };
      const mockTheme = {
        primary: '#ff0000',
        secondary: '#00ff00',
        darkmode: true
      };

      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <GlobalStyles />
        </UserContext.Provider>
      );

      expect(screen.queryAllByRole('global')).toHaveLength(1);

      // Проверим стили на основе темы и настроек пользователя
      expect(document.body.style.colorScheme).toBe(mockTheme.darkmode ? 'dark' : 'light');
      expect(document.body.style.background).toBe(mockTheme.secondary);
      expect(document.body.style.fontFamily).toBe('Poppins, sans-serif');
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: GlobalStyles.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для GlobalStyles
// ============================================
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@emotion/react';
import { create } from 'jss';
import { JssProvider } from 'react-jss';
import { UserContext } from '../contexts/UserContext';
import { ColorPalette } from '../theme/themeConfig';
import { GlobalStyles } from './GlobalStyles';

const mockUser = {
  settings: {
    reduceMotion: 'system'
  }
};

const jss = create({
  insertionPoint: document.head
});

describe('GlobalStyles Snapshot Tests', () => {
  test('should match snapshot with default props and system reduce motion setting', () => {
    const tree = renderer
      .create(
        <JssProvider jss={jss}>
          <ThemeProvider theme={{ secondary: '#fff', primary: '#0070f3' }}>
            <UserContext.Provider value={{ user: mockUser }}>
              <GlobalStyles />
            </UserContext.Provider>
          </ThemeProvider>
        </JssProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with dark mode enabled and system reduce motion setting', () => {
    const tree = renderer
      .create(
        <JssProvider jss={jss}>
          <ThemeProvider theme={{ secondary: '#fff', primary: '#0070f3', darkmode: true }}>
            <UserContext.Provider value={{ user: mockUser }}>
              <GlobalStyles />
            </UserContext.Provider>
          </ThemeProvider>
        </JssProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with custom reduce motion setting off', () => {
    const tree = renderer
      .create(
        <JssProvider jss={jss}>
          <ThemeProvider theme={{ secondary: '#fff', primary: '#0070f3' }}>
            <UserContext.Provider value={{ user: { settings: { reduceMotion: false } } }}>
              <GlobalStyles />
            </UserContext.Provider>
          </ThemeProvider>
        </JssProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with custom reduce motion setting on', () => {
    const tree = renderer
      .create(
        <JssProvider jss={jss}>
          <ThemeProvider theme={{ secondary: '#fff', primary: '#0070f3' }}>
            <UserContext.Provider value={{ user: { settings: { reduceMotion: true } } }}>
              <GlobalStyles />
            </UserContext.Provider>
          </ThemeProvider>
        </JssProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: GlobalStyles.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для GlobalStyles
// ============================================
Ниже приведён пример кода интеграционного теста для компонента `GlobalStyles` в формате TypeScript, использующего библиотеку MSW для мокирования сетевых запросов и библиотеки `@testing-library/react`, а также дополнительные инструменты, такие как `userEvent`.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlobalStyles } from './GlobalStyles'; // импортируйте компонент здесь
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContext } from '../contexts/UserContext';
import { ThemeProvider } from '@emotion/react';
import { Theme } from '../theme/themeConfig';

// Создайте mock store или используйте реальный reducer и state
const initialState = {};
const store = createStore((state = initialState, action) => state, {});

const server = setupServer(
  // Моки сетевых запросов, если они используются компонентом
  rest.get('/api/data', (req, res, ctx) =>
    res(ctx.json({ someData: 'mocked' })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GlobalStyles Integration Tests', () => {
  it('renders correctly with mocked data', async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <UserContext.Provider value={{ user: { settings: { reduceMotion: 'system' } } }}>
            <ThemeProvider theme={Theme}>
              <GlobalStyles />
            </ThemeProvider>
          </UserContext.Provider>
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.queryByText(/someData/i)).toBeInTheDocument());

    // Проверьте отображение данных на странице
    expect(screen.getByText(/someData/i).textContent).toEqual('mocked');

    // Дополнительные проверки пользовательского интерфейса
    userEvent.click(screen.getByRole('button'));
    expect(screen.queryByText(/click event/i)).not.toBeNull(); // проверка клика
  });
});
### Пояснение к коду:

1. **Настройка MSW**: Используется библиотека MSW для создания серверного мока (`setupServer`) и настройки сетевого запроса (`rest.get()`).
   
2. **Рендеринг компонента**: Компонент рендерится внутри памяти роутера (`MemoryRouter`), провайдера Redux (`Provider`), провайдера контекста пользователя (`UserContext.Provider`) и провайдера тем (`ThemeProvider`).

3. **Проверки**: После отрисовки страницы проверяется наличие текста, соответствующего ожидаемому результату, используя метод `waitFor()`. Также проверяются действия пользователя через `userEvent`.

Этот шаблон можно адаптировать под конкретные требования вашего приложения, добавляя необходимые проверки и мокирование дополнительных сетевых запросов.
