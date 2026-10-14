import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditTask from '../EditTask';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { Task } from '../../types/user';
import { createMemoryContext } from '../../__mocks__/createMemoryContext';

const mockTask: Task = {
  id: 'test-task-id',
  name: 'Test Task Name',
  description: 'This is a test task description.',
  color: '#ff0000',
  emoji: ':smile:',
  category: ['Work'],
  deadline: new Date().toISOString(),
  lastSave: new Date().toISOString(),
};

const mockUser = {
  tasks: [mockTask],
  settings: {
    enableCategories: true,
  },
};

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
    {children}
  </UserContext.Provider>
);

describe('EditTask', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.getByText(/Edit Task/i)).toBeInTheDocument();
      expect(screen.getByText(mockTask.name)).toBeInTheDocument();
      expect(screen.getByText(mockTask.description)).toBeInTheDocument();
      expect(screen.getByText(/Last edited/i)).toBeInTheDocument();
    });

    it('should render without task prop', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.queryByText(mockTask.name)).not.toBeInTheDocument();
      expect(screen.queryByText(mockTask.description)).not.toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    let component;

    beforeEach(() => {
      component = render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );
    });

    it('should update name field on change', async () => {
      await userEvent.type(component.getByLabelText(/Name/i), 'New Test Task');

      expect(component.getByDisplayValue('New Test Task')).toBeInTheDocument();
    });

    it('should update description field on change', async () => {
      await userEvent.type(component.getByLabelText(/Description/i), 'This is a new test description.');

      expect(component.getByDisplayValue('This is a new test description.')).toBeInTheDocument();
    });

    it('should clear deadline on click', async () => {
      const button = screen.getByRole('button', { name: /clear/i });
      await userEvent.click(button);

      expect(component.getByDisplayValue('')).toBeInTheDocument();
    });

    it('should save task on click', async () => {
      const saveButton = screen.getByRole('button', { name: /save/i });
      await userEvent.click(saveButton);

      expect(component.container).toHaveClass('MuiDialog-paper--exit');
    });

    it('should cancel task on click', async () => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);

      expect(component.container).toHaveClass('MuiDialog-paper--exit');
    });
  });

  describe('Вспомогательные функции', () => {
    it('should call onClose function on close', () => {
      const onCloseSpy = jest.fn();
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={onCloseSpy} />
          </MockUserContext>
        </MemoryRouter>
      );

      userEvent.click(screen.getByRole('button', { name: /close/i }));

      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('should update categories', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      const select = screen.getByRole('combobox', { name: /category/i });
      userEvent.selectOptions(select, ['Home']);

      expect(screen.getAllByText(/Home/i)).toHaveLength(1);
    });
  });

  describe('Проверки на ошибки', () => {
    it('should show error for empty name', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={{ ...mockTask, name: '' }} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });

    it('should show error for long name', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={{ ...mockTask, name: 'a'.repeat(TASK_NAME_MAX_LENGTH + 1) }} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.getByText(/Name is too long/i)).toBeInTheDocument();
    });

    it('should show error for long description', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={{ ...mockTask, description: 'a'.repeat(DESCRIPTION_MAX_LENGTH + 1) }} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.getByText(/Description is too long/i)).toBeInTheDocument();
    });
  });

  describe('Редактирование категории', () => {
    it('should update selected categories', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      const select = screen.getByRole('combobox', { name: /category/i });
      userEvent.selectOptions(select, ['Work', 'Personal']);

      expect(screen.getAllByText(/Work/i)).toHaveLength(1);
      expect(screen.getAllByText(/Personal/i)).toHaveLength(1);
    });
  });

  describe('Тестирование взаимодействия с дочерними компонентами', () => {
    it('should pass correct props to EmojiPicker', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      const emojiPicker = screen.getByRole('dialog', { name: /custom emoji picker/i });
      expect(emojiPicker).toBeInTheDocument();
    });

    it('should pass correct props to CategorySelect', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MemoryRouter>
        </MockUserContext>
      );

      const categorySelect = screen.getByRole('combobox', { name: /category/i });
      expect(categorySelect).toBeInTheDocument();
    });
  });
});

// Создание мока контекста пользователя
const createMemoryContext = createMemoryContext(UserContext);

// ============================================
// SNAPSHOT TESTS
// Файл: EditTask.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для EditTask
// ============================================
import renderer from 'react-test-renderer';
import { EditTask } from './EditTask';

describe('EditTask Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<EditTask />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Open and Closed States', () => {
    test('should match snapshot when closed', () => {
      const tree = renderer.create(<EditTask open={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when opened without task data', () => {
      const tree = renderer.create(<EditTask open={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when opened with task data', () => {
      const task = {
        id: 'test-task',
        name: 'Test Task',
        description: 'This is a test task.',
        category: ['Work'],
        color: '#ff0000',
        emoji: ':rocket:',
        deadline: new Date().toISOString(),
        lastSave: new Date().toISOString(),
      };
      const tree = renderer.create(<EditTask open={true} task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error Scenarios', () => {
    test('should match snapshot when name exceeds maximum length', () => {
      const task = {
        name: 'a'.repeat(TASK_NAME_MAX_LENGTH + 1),
      };
      const tree = renderer.create(<EditTask task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when description exceeds maximum length', () => {
      const task = {
        description: 'a'.repeat(DESCRIPTION_MAX_LENGTH + 1),
      };
      const tree = renderer.create(<EditTask task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Empty State', () => {
    test('should match snapshot when no task provided', () => {
      const tree = renderer.create(<EditTask open={true} task={undefined} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Disabled Save Button', () => {
    test('should match snapshot when save button is disabled due to empty name', () => {
      const task = {
        name: '',
        description: 'Test Description',
      };
      const tree = renderer.create(<EditTask task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when save button is disabled due to empty description', () => {
      const task = {
        name: 'Test Name',
        description: '',
      };
      const tree = renderer.create(<EditTask task={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when save button is disabled due to missing task', () => {
      const tree = renderer.create(<EditTask open={true} task={undefined} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: EditTask.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для EditTask
// ============================================
Ниже приведён пример структуры интеграционного теста для компонента `EditTask` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext'; // Предположим, что этот провайдер уже настроен в приложении
import { store } from '../../store'; // Импортируйте ваш Redux Store
import EditTask from './EditTask'; // импортируйте компонент для тестирования

// Настраиваем сервер MSW для мокирования сетевых запросов
const server = setupServer(
  // Моки сетевых запросов здесь...
  rest.get('/tasks/:id', (req, res, ctx) => {
    return res(ctx.json({
      id: req.params.id,
      name: 'Test Task',
      description: 'This is a test task.',
      deadline: '2023-10-10T12:00:00Z',
      category: ['Work'],
      color: '#FF0000',
      emoji: ':hammer:',
      lastSave: '2023-10-09T12:00:00Z'
    }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('EditTask Integration Tests', () => {
  it('should load task details and display them correctly', async () => {
    const history = createMemoryHistory({ initialEntries: ['/tasks/edit/1'] });

    render(
      <Provider store={store}>
        <BrowserRouter history={history}>
          <UserContext.Provider value={{ user: { settings: {} } }}>
            <EditTask open task={{ id: 1 }} onClose={() => {}} />
          </UserContext.Provider>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByRole('heading')).toBeInTheDocument());

    // Проверяем отображение заголовка задачи
    expect(screen.getByText(/Test Task/i)).toBeInTheDocument();

    // Проверяем отображение описания
    expect(screen.getByText(/This is a test task./i)).toBeInTheDocument();

    // Проверяем отображение категории
    expect(screen.getByText(/Work/i)).toBeInTheDocument();

    // Проверяем отображение даты последнего сохранения
    expect(screen.getByText(/Last edited yesterday/i)).toBeInTheDocument(); // Пример предположительной строки времени назад

    // Проверяем отображение цвета и иконки эмодзи
    expect(screen.getByRole('button').closest('.MuiChip-root')).toHaveStyleContaining('background-color: #ff0000');
    expect(screen.getByText(':hammer:'));

    // Проверяем возможность редактировать название задачи
    userEvent.type(screen.getByLabelText(/Name/i), 'New Name');
    expect(screen.getByLabelText(/Name/i).value).toEqual('New Name');

    // Проверяем возможность редактировать описание задачи
    userEvent.type(screen.getByLabelText(/Description/i), 'New Description');
    expect(screen.getByLabelText(/Description/i).value).toEqual('New Description');

    // Проверяем возможность изменения категории
    userEvent.click(screen.getByText(/Work/i));
    userEvent.click(screen.getByText(/Personal/i));
    expect(screen.queryByText(/Work/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Personal/i)).toBeInTheDocument();

    // Проверяем возможность изменения даты дедлайна
    userEvent.clear(screen.getByLabelText(/Deadline date/i));
    userEvent.type(screen.getByLabelText(/Deadline date/i), '2023-10-15T12:00:00Z');
    expect(screen.getByLabelText(/Deadline date/i).value).toEqual('2023-10-15T12:00:00Z');

    // Проверяем возможность сохранить изменения
    userEvent.click(screen.getByText(/Save/i));
    expect(history.location.pathname).toEqual('/');
  });
});
Этот пример демонстрирует базовый подход к написанию интеграционного теста для компонента `EditTask`. В реальных условиях вам может понадобиться настроить дополнительные провайдеры или изменить логику моков в зависимости от специфики вашего приложения.
