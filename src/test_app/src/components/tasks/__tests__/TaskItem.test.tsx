import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskItem from '../TaskItem';
import { Task } from '../../types/user';
import { UserContext } from '../../contexts/UserContext';
import { TaskContext } from '../../contexts/TaskContext';
import { useSortable } from '@dnd-kit/sortable';

const mockTask = {
  id: 'mock-id',
  name: 'Mock Task',
  date: new Date(),
  deadline: new Date(),
  sharedBy: 'User',
  category: ['category1'],
  color: '#ff0000',
  done: false,
};

const mockUser = {
  settings: {
    enableGlow: true,
  },
};

const mockTaskContext = {
  moveMode: false,
};

const MockComponent = () => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: 'mock-id' });
  return (
    <div
      ref={(node) => setNodeRef(node)}
      {...attributes}
      {...listeners}
      style={{
        transform: `translate(${transform.x}, ${transform.y})`,
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    />
  );
};

describe('TaskItem', () => {
  describe('Рендеринг', () => {
    it('should render without crashing', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByTestId('task-container')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getAllByRole('checkbox').length).toEqual(1);
      expect(screen.getByText(mockTask.name)).toBeInTheDocument();
      expect(screen.getByText(formatDate(mockTask.date))).toBeInTheDocument();
      expect(screen.queryByText('Pinned')).not.toBeInTheDocument();
      expect(screen.queryByText('Shared by User')).toBeInTheDocument();
      expect(screen.queryByText('Ring Alarm')).not.toBeInTheDocument();
    });

    it('should render with pinned task', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={{ ...mockTask, pinned: true }} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByText('Pinned')).toBeInTheDocument();
    });

    it('should render with shared by other user', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={{ ...mockTask, sharedBy: 'Other User' }} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByText('Shared by Other User')).toBeInTheDocument();
    });

    it('should render with completed task', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={{ ...mockTask, done: true }} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByRole('checkbox')).toHaveAttribute('checked');
      expect(screen.getByText('DoneRounded')).toBeInTheDocument();
    });

    it('should render with custom text highlighter', () => {
      const mockTextHighlighter = jest.fn(() => <strong>Highlighted Text</strong>);
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} textHighlighter={mockTextHighlighter} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(mockTextHighlighter).toHaveBeenCalledWith(mockTask.name);
      expect(screen.getByText('Highlighted Text')).toBeInTheDocument();
    });

    it('should render with links enabled', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} features={{ enableLinks: true }} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByText('Link')).toBeInTheDocument();
    });

    it('should render with draggable handle when in move mode', () => {
      const mockTaskContext = {
        moveMode: true,
      };
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    it('should call onSelect and onDeselect handlers', () => {
      const onSelectSpy = jest.fn();
      const onDeselectSpy = jest.fn();
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem
              task={mockTask}
              selection={{ onSelect: onSelectSpy, onDeselect: onDeselectSpy }}
            />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      userEvent.click(screen.getByRole('checkbox'));
      expect(onSelectSpy).toHaveBeenCalledWith(mockTask.id);
      userEvent.click(screen.getByRole('checkbox'));
      expect(onDeselectSpy).toHaveBeenCalledWith(mockTask.id);
    });

    it('should update state when checkbox is clicked', async () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      userEvent.click(screen.getByRole('checkbox'));
      await waitFor(() => expect(screen.getByRole('checkbox')).toHaveAttribute('checked'));
    });
  });

  describe('Вспомогательные функции', () => {
    it('should format date correctly', () => {
      const formattedDate = formatDate(new Date());
      expect(formattedDate).toMatch(/^\w{3}\s\d{2},\s\d{4}$/); // Пример формата: Mon 27, 2023
    });
  });

  describe('Дочерние компоненты', () => {
    it('should pass correct props to child components', () => {
      const mockChildComponent = () => <MockComponent />;
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} children={<mockChildComponent />} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByRole('button')).toBeInTheDocument(); // Проверяем наличие дочернего компонента
    });
  });
});

// Дополнительные моки или настройки можно добавить здесь, если потребуется

// ============================================
// SNAPSHOT TESTS
// Файл: TaskItem.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для TaskItem
// ============================================
import renderer from 'react-test-renderer';
import { TaskItem } from './TaskItem';

const createTask = (props = {}) =>
  ({ ...{
      id: 'test-task-id',
      name: 'Test Task Name',
      description: 'This is a test task description.',
      date: '2023-10-10T12:00:00Z',
      deadline: '2023-10-15T12:00:00Z',
      sharedBy: 'User',
      category: ['test-category'],
      color: '#ff0000',
      done: false,
      ...props
    } });

describe('TaskItem Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const task = createTask();
      const tree = renderer.create(<TaskItem task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Links Enabled', () => {
    test('should match snapshot when links are enabled', () => {
      const task = createTask({ enableLinks: true });
      const tree = renderer.create(<TaskItem task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Glow Disabled', () => {
    test('should match snapshot when glow is disabled', () => {
      const task = createTask({ enableGlow: false });
      const tree = renderer.create(<TaskItem task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Selection Enabled', () => {
    test('should match snapshot when selection is enabled', () => {
      const task = createTask({ enableSelection: true });
      const tree = renderer.create(<TaskItem task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Move Mode Enabled', () => {
    test('should match snapshot when move mode is enabled', () => {
      const task = createTask({ enableMoveMode: true });
      const tree = renderer.create(<TaskItem task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Context Menu', () => {
    test('should match snapshot when context menu is present', () => {
      const task = createTask();
      const tree = renderer.create(<TaskItem task={task} onContextMenu={() => {}} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Actions', () => {
    test('should match snapshot when actions are provided', () => {
      const task = createTask();
      const actions = <div>Custom Actions</div>;
      const tree = renderer.create(<TaskItem task={task} actions={actions} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Blur', () => {
    test('should match snapshot when blur is applied', () => {
      const task = createTask();
      const tree = renderer.create(<TaskItem task={task} blur />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Text Highlighter', () => {
    test('should match snapshot when text highlighter is used', () => {
      const task = createTask();
      const textHighlighter = (text) => <strong>{text}</strong>;
      const tree = renderer.create(<TaskItem task={task} textHighlighter={textHighlighter} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Selected Task', () => {
    test('should match snapshot when task is selected', () => {
      const task = createTask();
      const selection = { selectedIds: [task.id], onSelect: jest.fn(), onDeselect: jest.fn() };
      const tree = renderer.create(<TaskItem task={task} selection={selection} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Pinned Task', () => {
    test('should match snapshot when task is pinned', () => {
      const task = createTask({ pinned: true });
      const tree = renderer.create(<TaskItem task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Deadline', () => {
    test('should match snapshot when task has a deadline', () => {
      const task = createTask({ deadline: '2023-10-15T12:00:00Z' });
      const tree = renderer.create(<TaskItem task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Shared By', () => {
    test('should match snapshot when task is shared by someone', () => {
      const task = createTask({ sharedBy: 'Other User' });
      const tree = renderer.create(<TaskItem task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Categories', () => {
    test('should match snapshot when task has categories', () => {
      const task = createTask({ category: ['test-category'] });
      const tree = renderer.create(<TaskItem task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Completed Task', () => {
    test('should match snapshot when task is completed', () => {
      const task = createTask({ done: true });
      const tree = renderer.create(<TaskItem task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: TaskItem.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для TaskItem
// ============================================
Ниже представлен пример кода интеграционного теста для компонента `TaskItem` в формате TypeScript, использующий библиотеку MSW для мокирования API и библиотеки из экосистемы React Testing Library для симуляции пользовательского ввода и проверки интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContext } from '../../contexts/UserContext';
import { TaskContext } from '../../contexts/TaskContext';
import { TaskItem } from './TaskItem'; // импортируйте компонент здесь
import { reducer as rootReducer } from '../../reducers/index'; // замените на ваш путь к редуктору

// создайте сервер моков
const server = setupServer(
  rest.get('/api/tasks/:id', (req, res, ctx) =>
    res(ctx.json({ task: { id: req.params.id, name: 'Test Task' } })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// создайте mock store
const initialState = {
  tasks: [],
};
const store = createStore(rootReducer, initialState);

// создайте mock context
const userContextValue = {
  user: {
    settings: {
      enableGlow: true,
    },
  },
};
const taskContextValue = {
  moveMode: false,
};

describe('TaskItem Integration Tests', () => {
  it('renders correctly when task is loaded', async () => {
    render(
      <Provider store={store}>
        <UserContext.Provider value={userContextValue}>
          <TaskContext.Provider value={taskContextValue}>
            <TaskItem task={{ id: 'test-id', name: 'Test Task' }} />
          </TaskContext.Provider>
        </UserContext.Provider>
      </Provider>,
    );

    await waitFor(() => expect(screen.queryByText('Test Task')).toBeInTheDocument());

    // проверьте отображение элементов
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeNull(); // если чекбокс доступен
  });

  it('handles click event to select/deselect task', async () => {
    render(
      <Provider store={store}>
        <UserContext.Provider value={userContextValue}>
          <TaskContext.Provider value={taskContextValue}>
            <TaskItem task={{ id: 'test-id', name: 'Test Task' }} />
          </TaskContext.Provider>
        </UserContext.Provider>
      </Provider>,
    );

    const checkbox = screen.getByRole('checkbox');
    userEvent.click(checkbox); // имитируем клик на чекбоксе

    await waitFor(() => expect(checkbox).toHaveAttribute('aria-checked', 'true'));

    userEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toHaveAttribute('aria-checked', 'false'));
  });

  it('displays proper tooltip for task date', async () => {
    render(
      <Provider store={store}>
        <UserContext.Provider value={userContextValue}>
          <TaskContext.Provider value={taskContextValue}>
            <TaskItem task={{ id: 'test-id', name: 'Test Task', date: '2023-09-15T12:00:00Z' }} />
          </TaskContext.Provider>
        </UserContext.Provider>
      </Provider>,
    );

    const taskDate = screen.getByText('Sep 15, 2023'); // предполагаем формат даты

    await waitFor(() => expect(taskDate).toBeInTheDocument());

    userEvent.hover(taskDate);
    await waitFor(() => expect(screen.queryByText('September 15, 2023, 12:00 PM')).toBeInTheDocument());
  });

  it('handles drag-and-drop interaction', async () => {
    render(
      <Provider store={store}>
        <UserContext.Provider value={userContextValue}>
          <TaskContext.Provider value={{ moveMode: true }}>
            <TaskItem task={{ id: 'test-id', name: 'Test Task' }} />
          </TaskContext.Provider>
        </UserContext.Provider>
      </Provider>,
    );

    const dragHandle = screen.getByRole('draghandle');
    userEvent.drag(dragHandle, { clientX: 100, clientY: 100 }); // имитируем начало перетаскивания

    await waitFor(() => expect(screen.getByRole('draggable')).toHaveStyle({ transform: 'translate3d(100px, 100px, 0)' }));
  });
});
Этот пример демонстрирует базовую структуру интеграционного тестирования компонента `TaskItem`. В реальных сценариях вам потребуется расширить тесты, добавив проверку состояний загрузки (`loading`), обработку ошибок, взаимодействие с контентом внутри компонента и другие специфичные требования вашего приложения.
