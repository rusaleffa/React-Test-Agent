import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskIcon from '../TaskIcon';

describe('TaskIcon', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<TaskIcon />);
      expect(screen.getByRole('img')).toBeInTheDocument();  
    });

    it('should render with custom scale prop', () => {
      render(<TaskIcon scale={2} />);
      expect(screen.getByRole('img').getAttribute('width')).toEqual('432');
      expect(screen.getByRole('img').getAttribute('height')).toEqual('868');
    });

    it('should render with custom color prop', () => {
      render(<TaskIcon color="#ff0000" />);
      expect(screen.getByRole('img').querySelector('circle')).toHaveStyle({stroke: '#ff0000'});
    });

    it('should render with different variants', () => {
      render(<TaskIcon variant='add' />);
      expect(screen.queryByRole('img')).toMatchSnapshot();

      render(<TaskIcon variant='error' />);
      expect(screen.queryByRole('img')).toMatchSnapshot();

      render(<TaskIcon variant='success' />);
      expect(screen.queryByRole('img')).toMatchSnapshot();
    });
  });

  describe('SVG Filter', () => {
    it('should apply glow effect when enabled', () => {
      render(<TaskIcon settings={{ enableGlow: true }} />);
      expect(screen.getByRole('img')).toHaveStyleContaining(
        'filter: drop-shadow(0px 0px'
      );
    });

    it('should not apply glow effect when disabled', () => {
      render(<TaskIcon settings={{ enableGlow: false }} />);
      expect(screen.getByRole('img')).not.toHaveStyleContaining(
        'drop-shadow'
      );
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: TaskIcon.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для TaskIcon
// ============================================
import renderer from 'react-test-renderer';

describe('TaskIcon Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<TaskIcon />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error Icon', () => {
    test('should match snapshot with error prop', () => {
      const tree = renderer.create(<TaskIcon variant="error" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Add Icon', () => {
    test('should match snapshot with add prop', () => {
      const tree = renderer.create(<TaskIcon variant="add" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Success Icon', () => {
    test('should match snapshot with success prop', () => {
      const tree = renderer.create(<TaskIcon variant="success" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Custom Color', () => {
    test('should match snapshot with custom color', () => {
      const tree = renderer.create(<TaskIcon color="#ff0000" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Scale Prop', () => {
    test('should match snapshot with scale prop', () => {
      const tree = renderer.create(<TaskIcon scale={0.5} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('User Context Settings', () => {
    test('should match snapshot with glow enabled', () => {
      const contextValue = {
        user: {
          settings: {
            enableGlow: true,
          },
        },
      };
      const tree = renderer.create(
        <UserContext.Provider value={{ user: contextValue.user }}>
          <TaskIcon />
        </UserContext.Provider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with glow disabled', () => {
      const contextValue = {
        user: {
          settings: {
            enableGlow: false,
          },
        },
      };
      const tree = renderer.create(
        <UserContext.Provider value={{ user: contextValue.user }}>
          <TaskIcon />
        </UserContext.Provider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: TaskIcon.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для TaskIcon
// ============================================
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
