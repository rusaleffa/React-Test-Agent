import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Transfer from './Transfer';
import { UserContext } from '../../contexts/UserContext';
import { createMemoryContext } from '../../__mocks__/createMemoryContext';

const mockUser = {
  createdAt: new Date(),
  tasks: [
    {
      id: 'task1',
      name: 'Test Task',
      description: 'This is a test task',
      category: {
        id: 'cat1',
        name: 'Test Category'
      },
      emojisStyle: {},
      color: '#FF0000'
    }
  ],
  categories: []
};

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={createMemoryContext(mockUser)}>
    {children}
  </UserContext.Provider>
);

describe('Transfer', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <Transfer />
          </MockUserContext>
        </MemoryRouter>
      );
      expect(screen.getByText(/transfer/i)).toBeInTheDocument();
    });

    it('displays no tasks message when there are no tasks', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <Transfer />
          </MockUserContext>
        </MemoryRouter>
      );
      expect(screen.queryByText(/you don't have any tasks to export/i)).toBeInTheDocument();
    });

    it('displays tasks when they exist', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <Transfer />
          </MockUserContext>
        </MemoryRouter>
      );
      expect(screen.getByText(/test task/i)).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = render(
        <MemoryRouter>
          <MockUserContext>
            <Transfer />
          </MockUserContext>
        </MemoryRouter>
      );
    });

    it('handles task selection', async () => {
      const task = screen.getByText(/test task/i);
      userEvent.click(task);
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeChecked();
      });
    });

    it('exports selected tasks', async () => {
      const task = screen.getByText(/test task/i);
      userEvent.click(task);
      const exportButton = screen.getByText(/export selected to json/i);
      userEvent.click(exportButton);
      await waitFor(() => {
        expect(screen.getByText(/exported tasks/i)).toBeInTheDocument();
      });
    });

    it('exports all tasks', async () => {
      const exportAllButton = screen.getByText(/export all tasks to json/i);
      userEvent.click(exportAllButton);
      await waitFor(() => {
        expect(screen.getByText(/exported all tasks/i)).toBeInTheDocument();
      });
    });

    it('imports tasks via drag-and-drop', async () => {
      const dropzone = screen.getByRole('region');
      userEvent.dragAndDrop(dropzone, { file: new File(['{}'], 'test.json') });
      await waitFor(() => {
        expect(screen.getByText(/tasks successfully imported/i)).toBeInTheDocument();
      });
    });

    it('imports tasks via file upload', async () => {
      const fileInput = screen.getByLabelText(/select json file/i);
      userEvent.upload(fileInput, new File(['{}'], 'test.json'));
      await waitFor(() => {
        expect(screen.getByText(/tasks successfully imported/i)).toBeInTheDocument();
      });
    });

    it('imports tasks via clipboard', async () => {
      const clipboardInput = screen.getByRole('button', { name: /import json from clipboard/i });
      userEvent.click(clipboardInput);
      await waitFor(() => {
        expect(screen.getByText(/tasks successfully imported/i)).toBeInTheDocument();
      });
    });

    it('imports tasks via QR code', async () => {
      const qrCodeInput = screen.getByRole('button', { name: /scan qr code/i });
      userEvent.click(qrCodeInput);
      userEvent.type(screen.getByRole('dialog'), '{enter}');
      await waitFor(() => {
        expect(screen.getByText(/qr code scanned successfully/i)).toBeInTheDocument();
      });
    });

    it('imports tasks via link', async () => {
      const linkInput = screen.getByRole('button', { name: /paste link/i });
      userEvent.click(linkInput);
      userEvent.paste(linkInput, { target: 'text', data: `${location.href}` });
      await waitFor(() => {
        expect(screen.getByText(/tasks successfully imported/i)).toBeInTheDocument();
      });
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: Transfer.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Transfer
// ============================================
import renderer from 'react-test-renderer';
import { UserContext } from '../contexts/UserContext';
import { MemoryRouter } from 'react-router-dom';
import Transfer from './Transfer';

// Mock context values
const mockUser = {
  createdAt: Date.now(),
  emojisStyle: {},
  tasks: [
    {
      id: 'task1',
      name: 'Test Task',
      description: 'This is a test task',
      category: ['test-cat'],
      color: '#ff0000',
      emoji: '',
    },
  ],
  categories: [
    {
      id: 'cat1',
      name: 'test-cat',
      color: '#00ff00',
    },
  ],
};

const mockSetUser = jest.fn();

const mockContextValues = {
  user: mockUser,
  setUser: mockSetUser,
};

describe('Transfer Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={mockContextValues}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with no tasks', () => {
    const mockUserWithoutTasks = {
      ...mockUser,
      tasks: [],
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserWithoutTasks }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with multiple tasks', () => {
    const mockUserWithMultipleTasks = {
      ...mockUser,
      tasks: [
        {
          id: 'task1',
          name: 'Test Task',
          description: 'This is a test task',
          category: ['test-cat'],
          color: '#ff0000',
          emoji: '',
        },
        {
          id: 'task2',
          name: 'Another Test Task',
          description: 'This is another test task',
          category: ['another-cat'],
          color: '#00ff00',
          emoji: '',
        },
      ],
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserWithMultipleTasks }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with selected tasks', () => {
    const mockUserWithSelectedTasks = {
      ...mockUser,
      tasks: [
        {
          id: 'task1',
          name: 'Test Task',
          description: 'This is a test task',
          category: ['test-cat'],
          color: '#ff0000',
          emoji: '',
        },
        {
          id: 'task2',
          name: 'Another Test Task',
          description: 'This is another test task',
          category: ['another-cat'],
          color: '#00ff00',
          emoji: '',
        },
      ],
      selectedTasks: ['task1'],
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserWithSelectedTasks }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with empty selected tasks', () => {
    const mockUserWithEmptySelectedTasks = {
      ...mockUser,
      tasks: [
        {
          id: 'task1',
          name: 'Test Task',
          description: 'This is a test task',
          category: ['test-cat'],
          color: '#ff0000',
          emoji: '',
        },
        {
          id: 'task2',
          name: 'Another Test Task',
          description: 'This is another test task',
          category: ['another-cat'],
          color: '#00ff00',
          emoji: '',
        },
      ],
      selectedTasks: [],
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserWithEmptySelectedTasks }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with loading state', () => {
    const mockUserLoading = {
      ...mockUser,
      loading: true,
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserLoading }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with error state', () => {
    const mockUserError = {
      ...mockUser,
      error: 'An error occurred while fetching data.',
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserError }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: Transfer.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Transfer
// ============================================
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContext } from '../contexts/UserContext';
import { useStorageState } from '../hooks/useStorageState';
import Transfer from './Transfer'; // импортируйте компонент здесь

// создайте mock store или используйте реальный state
const initialState = {
  user: {
    createdAt: Date.now(),
    tasks: [
      {
        id: 'task1',
        name: 'Test Task',
        description: 'This is a test task',
        category: ['test-cat'],
        color: '#ff0000',
        emojisStyle: {},
      },
    ],
    categories: [
      {
        id: 'test-cat',
        name: 'Test Category',
        color: '#00ff00',
      },
    ],
  },
};

const store = createStore(() => initialState);

const server = setupServer(
  // моки API запросов
  rest.post('/api/sync', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Transfer Integration Tests', () => {
  it('should display tasks and allow selection', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserContext.Provider value={{ user: initialState.user, setUser: jest.fn() }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    expect(screen.queryByText('Test Task')).toBeInTheDocument();

    // проверка выбора задачи
    userEvent.click(screen.getByText('Test Task'));
    expect(useStorageState.mock.results[0].value).toEqual(['task1']);

    // проверка экспорта всех задач
    userEvent.click(screen.getByText(/Export All Tasks/i));
    expect(showToast).toHaveBeenCalledWith('Exported all tasks');

    // проверка импорта файла
    const fileInput = screen.getByLabelText('Select JSON File');
    userEvent.upload(fileInput, new Blob(['{"name": "New Task"}'], { type: 'application/json' }));
    expect(showToast).toHaveBeenCalledWith('Tasks Successfully Imported');

    // проверка сканирования QR-кода
    userEvent.click(screen.getByText(/Scan QR Code/i));
    userEvent.type(screen.getByRole('dialog'), 'http://localhost/test-link');
    userEvent.click(screen.getByRole('button', { name: /scan/i }));
    expect(navigate).toHaveBeenCalledWith('/test-link');
  });

  it('should handle errors properly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserContext.Provider value={{ user: initialState.user, setUser: jest.fn() }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter>
      </Provider>,
    );

    // проверка ошибки при неправильном файле
    const fileInput = screen.getByLabelText('Select JSON File');
    userEvent.upload(fileInput, new Blob(['{"name": 123}'], { type: 'application/json' }));
    expect(showToast).toHaveBeenCalledWith('Incorrect file type application/json.');

    // проверка ошибки при слишком большом размере файла
    userEvent.upload(fileInput, new Blob(['{"name": "a".repeat(1024 * 1024 * 7)}], { type: 'application/json' }));
    expect(showToast).toHaveBeenCalledWith('File size is too large');

    // проверка ошибки при некорректном формате категории
    userEvent.upload(fileInput, new Blob(['{"category": {"color": "red"}}'], { type: 'application/json' }));
    expect(showToast).toHaveBeenCalledWith('Imported file contains tasks with invalid color formats.');
  });
});
