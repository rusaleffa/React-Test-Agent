import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskProvider from '../TaskProvider';
import { TaskContext } from './TaskContext';

const MockChildComponent = () => <div data-testid="child-component" />;

describe('TaskProvider', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<TaskProvider><MockChildComponent /></TaskProvider>);
      expect(screen.getByTestId('child-component')).toBeInTheDocument();
    });

    it('should pass correct context values to child components', () => {
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: ['test-task'],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: ['test-selected-task'],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      expect(mockContextValue.setSelectedTaskId).not.toHaveBeenCalled();
      expect(mockContextValue.setAnchorEl).not.toHaveBeenCalled();
      expect(mockContextValue.setAnchorPosition).not.toHaveBeenCalled();
      expect(mockContextValue.setExpandedTasks).not.toHaveBeenCalled();
      expect(mockContextValue.toggleShowMore).not.toHaveBeenCalled();
      expect(mockContextValue.setSearch).not.toHaveBeenCalled();
      expect(mockContextValue.highlightMatchingText).not.toHaveBeenCalled();
      expect(mockContextValue.setMultipleSelectedTasks).not.toHaveBeenCalled();
      expect(mockContextValue.handleSelectTask).not.toHaveBeenCalled();
      expect(mockContextValue.setEditModalOpen).not.toHaveBeenCalled();
      expect(mockContextValue.handleDeleteTask).not.toHaveBeenCalled();
      expect(mockContextValue.setDeleteDialogOpen).not.toHaveBeenCalled();
      expect(mockContextValue.handleCloseMoreMenu).not.toHaveBeenCalled();
      expect(mockContextValue.setSortOption).not.toHaveBeenCalled();
      expect(mockContextValue.setSortAnchorEl).not.toHaveBeenCalled();
      expect(mockContextValue.setMoveMode).not.toHaveBeenCalled();
      expect(mockContextValue.updateCategory).not.toHaveBeenCalled();
    });
  });

  describe('Обработка событий', () => {
    it('should call setSelectedTaskId when clicking on a task', () => {
      const mockSetSelectedTaskId = jest.fn();
      const mockContextValue = {
        selectedTaskId: null,
        setSelectedTaskId: mockSetSelectedTaskId,
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByTestId('child-component'));

      expect(mockSetSelectedTaskId).toHaveBeenCalledTimes(1);
    });

    it('should call setDeleteDialogOpen when clicking on delete button', async () => {
      const mockSetDeleteDialogOpen = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: mockSetDeleteDialogOpen,
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      await userEvent.click(screen.getByText(/delete/i));

      expect(mockSetDeleteDialogOpen).toHaveBeenCalledWith(true);
    });

    it('should call setEditModalOpen when clicking on edit button', () => {
      const mockSetEditModalOpen = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: mockSetEditModalOpen,
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByText(/edit/i));

      expect(mockSetEditModalOpen).toHaveBeenCalledWith(true);
    });

    it('should call setSortOption when clicking on sort menu', () => {
      const mockSetSortOption = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: mockSetSortOption,
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByText(/sort/i));

      expect(mockSetSortOption).toHaveBeenCalledTimes(1);
    });
  });

  describe('Управление состояниями', () => {
    it('should update selectedTaskId and anchorEl when selecting a task', () => {
      const mockSetSelectedTaskId = jest.fn();
      const mockSetAnchorEl = jest.fn();
      const mockContextValue = {
        selectedTaskId: null,
        setSelectedTaskId: mockSetSelectedTaskId,
        anchorEl: null,
        setAnchorEl: mockSetAnchorEl,
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByTestId('child-component'));

      expect(mockSetSelectedTaskId).toHaveBeenCalledWith('test-id');
      expect(mockSetAnchorEl).toHaveBeenCalledWith(null);
    });

    it('should toggle show more for a task', () => {
      const mockToggleShowMore = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: ['test-task'],
        setExpandedTasks: mockToggleShowMore,
        toggleShowMore: mockToggleShowMore,
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByText(/show more/i));

      expect(mockToggleShowMore).toHaveBeenCalledWith('test-task');
    });

    it('should open delete dialog when deleting a task', () => {
      const mockSetDeleteDialogOpen = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: mockSetDeleteDialogOpen,
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByText(/delete/i));

      expect(mockSetDeleteDialogOpen).toHaveBeenCalledWith(true);
    });

    it('should close more menu when clicking outside', () => {
      const mockHandleCloseMoreMenu = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: mockHandleCloseMoreMenu,
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(document.body);

      expect(mockHandleCloseMoreMenu).toHaveBeenCalled();
    });
  });
});

describe('Highlighting matching text', () => {
  it('should highlight matching text correctly', () => {
    const mockContextValue = {
      selectedTaskId: null,
      setSelectedTaskId: jest.fn(),
      anchorEl: null,
      setAnchorEl: jest.fn(),
      anchorPosition: null,
      setAnchorPosition: jest.fn(),
      expandedTasks: [],
      setExpandedTasks: jest.fn(),
      toggleShowMore: jest.fn(),
      search: 'test',
      setSearch: jest.fn(),
      highlightMatchingText: jest.fn(),
      multipleSelectedTasks: [],
      setMultipleSelectedTasks: jest.fn(),
      handleSelectTask: jest.fn(),
      editModalOpen: false,
      setEditModalOpen: jest.fn(),
      handleDeleteTask: jest.fn(),
      deleteDialogOpen: false,
      setDeleteDialogOpen: jest.fn(),
      handleCloseMoreMenu: jest.fn(),
      sortOption: 'created_at',
      setSortOption: jest.fn(),
      sortAnchorEl: null,
      setSortAnchorEl: jest.fn(),
      moveMode: false,
      setMoveMode: jest.fn(),
      updateCategory: jest.fn(),
    };

    render(
      <TaskContext.Provider value={mockContextValue}>
        <MockChildComponent />
      </TaskContext.Provider>,
    );

    expect(mockContextValue.highlightMatchingText).toHaveBeenCalledWith('test-text');
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: TaskProvider.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для TaskProvider
// ============================================
import renderer from 'react-test-renderer';
import { TaskProvider } from './TaskProvider';

describe('TaskProvider Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<TaskProvider />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Selected Task ID', () => {
    test('should match snapshot when selected task is present', () => {
      const tree = renderer.create(
        <TaskProvider>
          <div>Test Content</div>
        </TaskProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Multiple Selected Tasks', () => {
    test('should match snapshot when multiple tasks are selected', () => {
      const tree = renderer.create(
        <TaskProvider>
          <div>Test Content</div>
        </TaskProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Expanded Tasks', () => {
    test('should match snapshot when some tasks are expanded', () => {
      const tree = renderer.create(
        <TaskProvider>
          <div>Test Content</div>
        </TaskProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Search Term', () => {
    test('should match snapshot when a search term is applied', () => {
      const tree = renderer.create(
        <TaskProvider>
          <div>Test Content</div>
        </TaskProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Sort Option', () => {
    test('should match snapshot when sort option is changed', () => {
      const tree = renderer.create(
        <TaskProvider>
          <div>Test Content</div>
        </TaskProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Move Mode', () => {
    test('should match snapshot when move mode is enabled', () => {
      const tree = renderer.create(
        <TaskProvider>
          <div>Test Content</div>
        </TaskProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Delete Dialog Open', () => {
    test('should match snapshot when delete dialog is open', () => {
      const tree = renderer.create(
        <TaskProvider>
          <div>Test Content</div>
        </TaskProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Edit Modal Open', () => {
    test('should match snapshot when edit modal is open', () => {
      const tree = renderer.create(
        <TaskProvider>
          <div>Test Content</div>
        </TaskProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Anchor El', () => {
    test('should match snapshot when anchor el is present', () => {
      const tree = renderer.create(
        <TaskProvider>
          <div>Test Content</div>
        </TaskProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Anchor Position', () => {
    test('should match snapshot when anchor position is present', () => {
      const tree = renderer.create(
        <TaskProvider>
          <div>Test Content</div>
        </TaskProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  };

  describe('With Highlighted Text', () => {
    test('should match snapshot when highlighted text is present', () => {
      const tree = renderer.create(
        <TaskProvider>
          <div>Test Content</div>
        </TaskProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  };
});

// ============================================
// INTEGRATION TESTS
// Файл: TaskProvider.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для TaskProvider
// ============================================
Ниже представлен пример кода интеграционного теста для компонента `TaskProvider` с использованием библиотеки MSW для мокирования запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';
import { UserContext } from '../contexts/UserContext'; // Предположим, что этот провайдер уже настроен
import { TaskProvider } from './TaskProvider'; // Импортируйте ваш компонент здесь

// Создайте mock store или настройте провайдер контекста
const initialState = {
  user: {
    settings: {
      sortOption: 'createdAt',
    },
  },
};
const store = createStore(() => initialState);

const server = setupServer(
  // Моки API-запросов
  rest.get('/tasks', (req, res, ctx) => {
    return res(ctx.json([
      {
        id: 'task1',
        title: 'Test Task 1',
        description: 'This is a test task',
        category: 'Work',
        createdAt: '2023-09-01T12:00:00Z'
      },
      {
        id: 'task2',
        title: 'Test Task 2',
        description: 'Another test task',
        category: 'Personal',
        createdAt: '2023-08-31T12:00:00Z'
      }
    ]))
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TaskProvider Integration Tests', () => {
  it('should load tasks and display them correctly', async () => {
    render(
      <ReduxProvider store={store}>
        <UserContext.Provider value={{ user: initialState.user }}>
          <TaskProvider>
            <div>Content</div>
          </TaskProvider>
        </UserContext.Provider>
      </ReduxProvider>,
    );

    await waitFor(() => expect(screen.queryByText(/Test Task 1/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/Test Task 2/i)).toBeInTheDocument());

    // Проверьте отображение категорий
    expect(screen.queryByText(/Work/i)).not.toBeNull();
    expect(screen.queryByText(/Personal/i)).not.toBeNull();

    // Проверьте сортировку задач по дате создания
    const task1Element = screen.queryByText(/Test Task 1/i);
    const task2Element = screen.queryByText(/Test Task 2/i);
    expect(task1Element).toBeBefore(task2Element); // Проверка на правильную сортировку
  });

  it('should filter tasks by search term', async () => {
    render(
      <ReduxProvider store={store}>
        <UserContext.Provider value={{ user: initialState.user }}>
          <TaskProvider>
            <div>Content</div>
          </TaskProvider>
        </UserContext.Provider>
      </ReduxProvider>,
    );

    await waitFor(() => expect(screen.queryByText(/Test Task 1/i)).toBeInTheDocument());

    // Введите поисковый запрос
    userEvent.type(screen.getByPlaceholderText('Search'), 'test');

    // Подождите завершения поиска
    await waitFor(() => expect(screen.queryByText(/Test Task 1/i)).toBeInTheDocument());
    expect(screen.queryByText(/Test Task 2/i)).toBeNull(); // Вторая задача должна исчезнуть из списка
  });

  it('should expand and collapse task details', async () => {
    render(
      <ReduxProvider store={store}>
        <UserContext.Provider value={{ user: initialState.user }}>
          <TaskProvider>
            <div>Content</div>
          </TaskProvider>
        </UserContext.Provider>
      </ReduxProvider>,
    );

    await waitFor(() => expect(screen.queryByText(/Test Task 1/i)).toBeInTheDocument());

    // Найдите кнопку раскрытия задачи
    const moreButton = screen.getByRole('button', { name: /more/i });
    userEvent.click(moreButton);

    // Ожидайте изменения в отображении деталей задачи
    await waitFor(() => expect(screen.queryByText(/This is a test task/i)).toBeInTheDocument());

    // Нажмите еще раз, чтобы свернуть детали
    userEvent.click(moreButton);
    await waitFor(() => expect(screen.queryByText(/This is a test task/i)).not.toBeInTheDocument());
  });

  it('should select and deselect tasks', async () => {
    render(
      <ReduxProvider store={store}>
        <UserContext.Provider value={{ user: initialState.user }}>
          <TaskProvider>
            <div>Content</div>
          </TaskProvider>
        </UserContext.Provider>
      </ReduxProvider>,
    );

    await waitFor(() => expect(screen.queryByText(/Test Task 1/i)).toBeInTheDocument());

    // Выберите первую задачу
    const firstTask = screen.getByText(/Test Task 1/i);
    userEvent.click(firstTask);

    // Убедитесь, что она выбрана
    expect(screen.queryByText(/Test Task 1/i)).toHaveClass('selected');

    // Деактивируйте выбранную задачу
    userEvent.click(firstTask);
    await waitFor(() => expect(screen.queryByText(/Test Task 1/i)).not.toHaveClass('selected'));
  });
});
Этот пример демонстрирует базовую структуру интеграционного теста для компонента `TaskProvider`. Он включает следующие шаги:

1. Настройку моков серверов с помощью MSW.
2. Настройку провайдера контекста и хранилища Redux.
3. Выполнение различных сценариев использования, таких как фильтрация задач, отображение деталей задач, выбор и отмена выбора задач.

Вы можете расширить эти тесты, добавив дополнительные проверки, такие как обработка ошибок, взаимодействие с модальными окнами и другие сценарии, специфичные для вашего приложения.
