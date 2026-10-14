import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import { UserContext } from '../contexts/UserContext';
import { createMemoryContext } from '../__mocks__/createMemoryContext';

jest.mock('../utils/showToast');

const mockUser = {
  tasks: [],
};

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={mockUser}>{children}</UserContext.Provider>
);

describe('ErrorBoundary', () => {
  let mockError;

  beforeEach(() => {
    mockError = new Error('Test error message');
  });

  describe('Rendering', () => {
    it('renders without error when no error occurs', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );
      expect(screen.getByText(/hello world/i)).toBeInTheDocument();
    });

    it('renders error boundary when an error occurs', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
              {throwError()}
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.getByText(/oops! an error occurred/i)).toBeInTheDocument();
    });

    function throwError() {
      throw mockError;
    }
  });

  describe('Handling Errors', () => {
    it('displays error details', async () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
              {throwError()}
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );

      await waitFor(() => screen.getByText(mockError.name));
      await waitFor(() => screen.getByText(mockError.message));
    });

    it('shows alert about losing data', async () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
              {throwError()}
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );

      await waitFor(() =>
        screen.getByText(/by cleaning app data, you will lose all of your tasks/i),
      );
    });

    it('handles auto-clear dialog', async () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
              {throwError()}
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );

      userEvent.click(screen.getByText(/auto clear/i));
      await waitFor(() => screen.getByRole('dialog'));

      userEvent.click(screen.getByText(/confirm/i));
      expect(localStorage.clear).toHaveBeenCalled();
      expect(sessionStorage.clear).toHaveBeenCalled();
      expect(location.reload).toHaveBeenCalled();
    });

    it('exports tasks to json', async () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
              {throwError()}
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );

      userEvent.click(screen.getByText(/export tasks to json/i));
      expect(showToast).toHaveBeenCalledWith('Exported all tasks (0)');
    });
  });
});

// Mock for showToast
function showToast(message, options) {
  console.log(`${message}, ${options}`);
}

// ============================================
// SNAPSHOT TESTS
// Файл: UnstyledButton.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для UnstyledButton
// ============================================
import renderer from 'react-test-renderer';
import { UnstyledButton } from './path/to/your/file'; // Подставьте путь к вашему файлу

describe('UnstyledButton Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<UnstyledButton />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Different Variants', () => {
    test('should match snapshot with outlined variant', () => {
      const tree = renderer.create(<UnstyledButton variant="outlined" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with contained variant', () => {
      const tree = renderer.create(<UnstyledButton variant="contained" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with outlined variant and disabled state', () => {
      const tree = renderer.create(<UnstyledButton variant="outlined" disabled />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with contained variant and disabled state', () => {
      const tree = renderer.create(<UnstyledButton variant="contained" disabled />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Children', () => {
    test('should match snapshot with custom children', () => {
      const tree = renderer.create(
        <UnstyledButton>
          <strong>Test Button</strong>
        </UnstyledButton>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Color', () => {
    test('should match snapshot with primary color', () => {
      const tree = renderer.create(<UnstyledButton color="primary" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with secondary color', () => {
      const tree = renderer.create(<UnstyledButton color="secondary" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with tertiary color', () => {
      const tree = renderer.create(<UnstyledButton color="tertiary" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Size', () => {
    test('should match snapshot with small size', () => {
      const tree = renderer.create(<UnstyledButton size="small" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with medium size', () => {
      const tree = renderer.create(<UnstyledButton size="medium" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with large size', () => {
      const tree = renderer.create(<UnstyledButton size="large" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: UnstyledButton.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для UnstyledButton
// ============================================
Ниже представлен пример кода интеграционного теста для компонента `ErrorBoundary` в формате TypeScript с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';
import { UserContext } from '../contexts/UserContext'; // Предположительно импортируется из вашего проекта
import { ErrorBoundary } from './ErrorBoundary'; // Импортируйте компонент, который хотите протестировать
import { mockUserData } from '../mocks/user.mock'; // Импортируйте данные пользователя для контекста

// Создаем сервер MSW для мокирования сетевых запросов
const server = setupServer(
  // Моки для API здесь...
  // Например:
  rest.get('/api/tasks', (req, res, ctx) =>
    res(ctx.json(mockUserData.tasks)),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Создаем хранилище Redux и добавляем начальные данные
const store = createStore((state) => state, {
  user: {
    ...mockUserData,
  },
});

// Настраиваем контекст UserContext
const userContextValue = {
  user: mockUserData,
};

describe('ErrorBoundary Integration Tests', () => {
  it('should render correctly when no error occurs', async () => {
    render(
      <ReduxProvider store={store}>
        <UserContext.Provider value={userContextValue}>
          <ErrorBoundary>
            {/* Здесь можно добавить любой безопасный рендеринг контента */}
          </ErrorBoundary>
        </UserContext.Provider>
      </ReduxProvider>,
    );

    expect(screen.queryByText(/an error occurred/i)).not.toBeInTheDocument(); // Проверяем отсутствие сообщения об ошибке
  });

  it('should render error message and provide correct actions when an error occurs', async () => {
    // Вызываем ошибку вручную
    throw new Error('Test error');

    render(
      <ReduxProvider store={store}>
        <UserContext.Provider value={userContextValue}>
          <ErrorBoundary>
            <button>Click me to trigger error</button>
          </ErrorBoundary>
        </UserContext.Provider>
      </ReduxProvider>,
    );

    await waitFor(() => screen.getByText(/oops! an error occurred/i)); // Ожидаем появления сообщения об ошибке

    // Проверка наличия кнопки очистки данных
    const clearDataButton = screen.getByText(/auto clear/i);
    expect(clearDataButton).toBeInTheDocument();

    // Проверка наличия кнопки перезагрузки страницы
    const reloadPageButton = screen.getByText(/refresh page/i);
    expect(reloadPageButton).toBeInTheDocument();

    // Проверка наличия ссылки на GitHub Issues
    const githubIssueLink = screen.getByRole('link', { name: /github issues/i });
    expect(githubIssueLink).toHaveAttribute('href', 'https://github.com/maciekt07/TodoApp/issues');

    // Проверка наличия выпадающего списка со стеком ошибок
    const errorStackAccordion = screen.getByText(/error stack/i);
    expect(errorStackAccordion).toBeInTheDocument();

    // Проверка наличия кнопки экспорта задач
    const exportTasksButton = screen.getByText(/export tasks to json/i);
    expect(exportTasksButton).toBeInTheDocument();

    // Проверка наличия предупреждения о потере данных при очистке
    const alertMessage = screen.getByRole('alert', { name: /by cleaning app data/i });
    expect(alertMessage).toBeInTheDocument();

    // Проверка наличия диалогового окна подтверждения очистки данных
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Проверка текста внутри диалогового окна
    const dialogContent = screen.getByText(/are you sure you want to clear all data/i);
    expect(dialogContent).toBeInTheDocument();

    // Проверка кнопок диалога
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(cancelButton).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();

    // Проверка отображения стека ошибок после нажатия на кнопку развернуть
    userEvent.click(errorStackAccordion);
    const expandedErrorStack = screen.getByText(/error stack/i);
    expect(expandedErrorStack).toBeInTheDocument();
  });
});
Этот пример демонстрирует базовую структуру интеграционного теста для компонента `ErrorBoundary`. В реальных сценариях вам может понадобиться расширить тесты дополнительными проверками, например, взаимодействием с реальными API или более сложными действиями пользователей.
