import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskManagementContainer from '../TaskManagementContainer';

describe('TaskManagementContainer', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<TaskManagementContainer />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText(/task management/i)).toBeInTheDocument();
    });

    it('should render with custom background color and selected state', () => {
      render(
        <TaskManagementContainer backgroundClr="#ff0000" selected={true} />
      );
      expect(screen.getByRole('button').style.backgroundColor).toEqual(
        'rgba(255, 0, 0, 0.3)'
      );
      expect(screen.getByRole('button').style.borderColor).toEqual('#ff0000');
      expect(screen.queryByText(/task management/i)).not.toBeNull();
    });

    it('should handle click event', async () => {
      render(<TaskManagementContainer />);
      await userEvent.click(screen.getByRole('button'));
      expect(screen.getByText(/task management/i)).toHaveStyle({
        'font-weight': '600',
      });
    });
  });

  describe('Обработка событий', () => {
    it('should call onClick handler when button clicked', () => {
      const mockOnClick = jest.fn();
      render(
        <TaskManagementContainer onClick={mockOnClick}>
          <div data-testid="test-element">Test Element</div>
        </TaskManagementContainer>
      );
      userEvent.click(screen.getByRole('button'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Вспомогательные функции', () => {
    it('getFontColor should return correct color based on theme', () => {
      const theme = { darkmode: true };
      const result = getFontColor(theme.secondary);
      expect(result).toMatch(/#/); // Проверяем наличие хэштега в результате
    });
  });

  describe('Взаимодействие с дочерними компонентами', () => {
    it('DropZone should pass isDragging prop to its children', () => {
      render(
        <TaskManagementContainer>
          <DropZone isDragging={true}>Drag Zone</DropZone>
        </TaskManagementContainer>
      );
      expect(screen.getByText('Drag Zone').parentElement.style.boxShadow).toContain(
        '0 0 32px -2px'
      );
    });
  });
});

// Если необходимо мока внешнего API или других зависимостей, добавить соответствующие тесты здесь.

// ============================================
// SNAPSHOT TESTS
// Файл: TaskManagementContainer.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для TaskManagementContainer
// ============================================
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    primary: '#ff7961',
    secondary: '#4caf50',
    darkmode: false,
  },
});

const darkTheme = createTheme({
  palette: {
    primary: '#ff7961',
    secondary: '#4caf50',
    darkmode: true,
  },
});

describe('TaskManagementContainer Snapshot Tests', () => {
  // Light mode tests
  describe('Light Mode', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(
        <ThemeProvider theme={lightTheme}>
          <TaskManagementContainer />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with selected prop', () => {
      const tree = renderer.create(
        <ThemeProvider theme={lightTheme}>
          <TaskManagementContainer selected />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with different background color', () => {
      const tree = renderer.create(
        <ThemeProvider theme={lightTheme}>
          <TaskManagementContainer backgroundClr="#f0f0f0" />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // Dark mode tests
  describe('Dark Mode', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(
        <ThemeProvider theme={darkTheme}>
          <TaskManagementContainer />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with selected prop', () => {
      const tree = renderer.create(
        <ThemeProvider theme={darkTheme}>
          <TaskManagementContainer selected />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with different background color', () => {
      const tree = renderer.create(
        <ThemeProvider theme={darkTheme}>
          <TaskManagementContainer backgroundClr="#f0f0f0" />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: TaskManagementContainer.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для TaskManagementContainer
// ============================================
Ниже представлен пример кода интеграционного тестирования компонента `TaskManagementContainer` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для проверки пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskManagementContainer } from './TaskManagementContainer'; // импортируйте компонент здесь

const server = setupServer(
  // Мокируем успешный запрос к API
  rest.get('/tasks', (req, res, ctx) =>
    res(ctx.json([
      { id: 1, title: 'Task 1' },
      { id: 2, title: 'Task 2' },
    ]))
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TaskManagementContainer Integration Tests', () => {
  it('should load tasks and display them correctly', async () => {
    render(<TaskManagementContainer />); // рендерим компонент

    await waitFor(() => expect(screen.queryByText(/Task 1/i)).toBeInTheDocument()); // ожидаем появления первого элемента списка задач
    await waitFor(() => expect(screen.queryByText(/Task 2/i)).toBeInTheDocument()); // ожидаем появления второго элемента списка задач

    // проверяем наличие заголовка раздела
    expect(screen.getByRole('heading')).toHaveTextContent('Task Management');

    // проверка наличия кнопки добавления задачи
    const addTaskButton = screen.getByRole('button', { name: /add task/i });
    expect(addTaskButton).toBeInTheDocument();

    // симуляция клика на кнопку добавления новой задачи
    userEvent.click(addTaskButton);

    // ожидание открытия модального окна или формы создания задачи
    // добавьте дополнительные проверки в зависимости от реализации вашего компонента
  });

  it('should handle errors when fetching tasks', async () => {
    server.use(
      // Мокируем ошибку при запросе данных
      rest.get('/tasks', (req, res, ctx) => res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }))),
    );

    render(<TaskManagementContainer />);

    await waitFor(() => expect(screen.queryByText(/Error/i)).toBeInTheDocument()); // ожидаем отображения сообщения об ошибке
  });
});
### Примечания:
- **MSW**: Используется для мокирования сетевых запросов и имитации поведения API.
- **Testing Library**: Для проверки элементов DOM и их содержимого.
- **User Event**: Для эмуляции действий пользователя (клик, ввод текста и т.д.).
- **waitFor**: Позволяет ожидать выполнения асинхронных операций перед продолжением теста.

Этот базовый набор тестов демонстрирует основные сценарии интеграции, такие как успешная загрузка данных, обработка ошибок и взаимодействие с элементами пользовательского интерфейса. Вы можете расширить тесты в соответствии со спецификацией требований и функциональностью вашего приложения.
