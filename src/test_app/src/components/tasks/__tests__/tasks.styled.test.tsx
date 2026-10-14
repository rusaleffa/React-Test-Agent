import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskContainer from './tasks.styled.tsx';  

describe('TaskContainer', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<TaskContainer />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        backgroundColor: '#ffffff',
        opacity: '1',
        borderLeft: '1px solid transparent'
      });
    });

    it('should render with custom background color', () => {
      render(<TaskContainer backgroundColor="#ff0000" done={false} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        backgroundColor: '#ff0000',
        opacity: '1',
        borderLeft: '1px solid transparent'
      });
    });

    it('should render with done state', () => {
      render(<TaskContainer backgroundColor="#ff0000" done={true} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        backgroundColor: '#ff0000cc',
        opacity: '0.8',
        borderLeft: '8px solid #00ff1ee3'
      });
    });

    it('should render with glow effect', () => {
      render(<TaskContainer backgroundColor="#ff0000" glow={true} blur={false} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        boxShadow: '0 0 128px -20px #ff0000'
      });
    });

    it('should render with blur effect', () => {
      render(<TaskContainer backgroundColor="#ff0000" blur={true} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        filter: 'blur(2px) opacity(75%)'
      });
    });

    it('should render with dark theme', () => {
      render(<TaskContainer backgroundColor="#000000" done={false} theme={{ primary: '#000000' }} />, {
        initialWindowSize: { width: 1024, height: 768 },
      });
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        backgroundColor: '#000000',
        color: '#ffffff'
      });
    });
  });

  describe('Обработка событий', () => {
    it('should handle click event', async () => {
      render(<TaskContainer backgroundColor="#ff0000" done={false} />);
      await userEvent.click(screen.getByRole('checkbox'));
      expect(screen.getByRole('checkbox').checked).toEqual(true);
    });
  });

  describe('Взаимодействие с дочерними элементами', () => {
    it('should pass correct props to child components', () => {
      render(
        <TaskContainer>
          <TaskInfo />
        </TaskContainer>
      );
      expect(screen.getByRole('heading', { name: 'Task Name' }).parentElement).toHaveAttribute('data-testid', 'task-info');
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: TaskContainer.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для TaskContainer
// ============================================
import renderer from 'react-test-renderer';
import TaskContainer from './TaskContainer'; // Импортируйте компонент здесь

describe('TaskContainer Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<TaskContainer />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Done Prop', () => {
    test('should match snapshot with done prop set to true', () => {
      const tree = renderer.create(<TaskContainer done={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with done prop set to false', () => {
      const tree = renderer.create(<TaskContainer done={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Glow Prop', () => {
    test('should match snapshot with glow prop set to true', () => {
      const tree = renderer.create(<TaskContainer glow={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with glow prop set to false', () => {
      const tree = renderer.create(<TaskContainer glow={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Blur Prop', () => {
    test('should match snapshot with blur prop set to true', () => {
      const tree = renderer.create(<TaskContainer blur={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with blur prop set to false', () => {
      const tree = renderer.create(<TaskContainer blur={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With IsDragging Prop', () => {
    test('should match snapshot with isDragging prop set to true', () => {
      const tree = renderer.create(<TaskContainer isDragging={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with isDragging prop set to false', () => {
      const tree = renderer.create(<TaskContainer isDragging={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With BackgroundColor Prop', () => {
    test('should match snapshot with light background color', () => {
      const tree = renderer.create(<TaskContainer backgroundColor="#ffffff" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with dark background color', () => {
      const tree = renderer.create(<TaskContainer backgroundColor="#000000" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // Добавьте дополнительные тесты для других возможных сценариев и состояний компонента
});

// ============================================
// INTEGRATION TESTS
// Файл: TaskContainer.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для TaskContainer
// ============================================
Ниже представлен пример кода интеграционного тестирования компонента `TaskContainer`, который учитывает требования и структуру, описанные в задаче.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';  
import configureStore from '../../store/configureStore';  
import TaskContainer from './TaskContainer';

// Имитация данных из API
const mockData = [
  {
    id: 1,
    title: 'Test Task',
    description: 'This is a test task.',
    dueDate: '2023-10-10',
    categories: ['Work'],
    status: 'active'
  },
];

// Моки серверного API
const server = setupServer(
  rest.get('/tasks', (req, res, ctx) => {
    return res(ctx.json(mockData));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Создаем хранилище Redux
const store = configureStore();

describe('TaskContainer Integration Tests', () => {
  it('renders correctly with mocked data', async () => {
    render(
      <Provider store={store}>
        <TaskContainer />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText(/test task/i)).toBeInTheDocument());
    expect(screen.getByText(/this is a test task./i)).toBeInTheDocument();
    expect(screen.getByText(/work/i)).toBeInTheDocument(); // Проверка категории
  });

  it('handles loading state', async () => {
    server.use(
      rest.get('/tasks', (req, res, ctx) => {
        return res(ctx.delay(1000), ctx.json([])); // Задержка перед ответом
      })
    );

    render(
      <Provider store={store}>
        <TaskContainer />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/loading/i)).toBeInTheDocument()); // Проверяем состояние загрузки
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()); // Проверяем завершение загрузки
  });

  it('displays error message', async () => {
    server.use(
      rest.get('/tasks', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
      })
    );

    render(
      <Provider store={store}>
        <TaskContainer />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText(/internal server error/i)).toBeInTheDocument());
  });

  it('interacts with search input', async () => {
    render(
      <Provider store={store}>
        <TaskContainer />
      </Provider>
    );

    const searchInput = screen.getByRole('textbox');
    userEvent.type(searchInput, 'test task');
    await waitFor(() => expect(screen.getByText(/test task/i)).toBeInTheDocument());
  });

  it('interacts with checkbox', async () => {
    render(
      <Provider store={store}>
        <TaskContainer />
      </Provider>
    );

    const checkBox = screen.getByRole('checkbox');
    userEvent.click(checkBox);
    await waitFor(() => expect(checkBox).toHaveAttribute('aria-checked', 'true'));
  });
});
Этот набор тестов проверяет следующие аспекты:

- Правильное отображение данных после успешной загрузки.
- Отображение сообщения об ошибке при возникновении проблемы на стороне сервера.
- Корректное взаимодействие с поисковым полем.
- Реакцию чекбокса на пользовательские действия.

Обратите внимание, что тесты используют библиотеку `@testing-library/react` для проверки DOM-элементов и библиотеки `msw` для имитации сетевых запросов и ответов.
