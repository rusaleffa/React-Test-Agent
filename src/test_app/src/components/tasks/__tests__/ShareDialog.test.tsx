import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ShareDialog from './ShareDialog';
import { UserContext } from '../../contexts/UserContext';
import { Task } from '../../types/user';
import { ToastStore } from 'react-hot-toast';

const mockUser = {
  user: {
    name: 'Test User',
    settings: {},
  },
};

const mockTask: Task = {
  id: 'test-task-id',
  name: 'Test Task Name',
  description: 'Test Description',
  deadline: new Date('2023-10-10T12:00:00'),
  category: 'Work',
};

jest.mock('react-hot-toast', () => ({
  useToasterStore: () => ({
    toasts: [],
  }),
}));

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={{ user: mockUser }}>
    {children}
  </UserContext.Provider>
);

describe('ShareDialog', () => {
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog open onClose={() => {}} selectedTask={mockTask} />
          </MockUserContext>
        </MemoryRouter>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Share Task')).toBeInTheDocument();
      expect(screen.getByText('Share your task with others.')).toBeInTheDocument();
      expect(screen.getByText(mockTask.name)).toBeInTheDocument();
    });

    it('renders with custom tab values', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={() => {}}
              selectedTask={mockTask}
              shareTabVal={1}
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      expect(screen.getAllByRole('tab')[1]).toHaveClass('Mui-selected');
    });

    it('renders download qr code button', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={() => {}}
              selectedTask={mockTask}
              shareTabVal={1}
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      expect(screen.getByText('Download QR Code')).toBeInTheDocument();
    });

    it('renders add to apple calendar button when appropriate', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={() => {}}
              selectedTask={mockTask}
              shareTabVal={2}
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      expect(screen.getByText('Add to Apple Calendar')).toBeInTheDocument();
    });
  });

  describe('Events', () => {
    it('copies link to clipboard', async () => {
      const mockOnClose = jest.fn();
      const mockGenerateShareableLink = jest.fn(() =>
        'http://example.com/share/task=test&user=Test+User',
      );

      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={mockOnClose}
              selectedTask={mockTask}
              shareTabVal={0}
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      const copyButton = screen.getByText('Copy');
      fireEvent.click(copyButton);

      await waitFor(() => expect(mockOnClose).not.toHaveBeenCalled());
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'http://example.com/share/task=test&user=Test+User',
      );
    });

    it('shares link using navigator.share', async () => {
      const mockOnClose = jest.fn();
      const mockGenerateShareableLink = jest.fn(() =>
        'http://example.com/share/task=test&user=Test+User',
      );

      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={mockOnClose}
              selectedTask={mockTask}
              shareTabVal={0
              }
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      const shareButton = screen.getByText('Share');
      fireEvent.click(shareButton);

      await waitFor(() => expect(mockOnClose).not.toHaveBeenCalled());
      expect(navigator.share).toHaveBeenCalledWith({
        title: 'Share Task',
        text: `Check out this task: Test Task Name`,
        url: 'http://example.com/share/task=test&user=Test+User',
      });
    });

    it('adds task to apple calendar', async () => {
      const mockOnClose = jest.fn();
      const mockGenerateShareableLink = jest.fn(() =>
        'http://example.com/share/task=test&user=Test+User',
      );

      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={mockOnClose}
              selectedTask={mockTask}
              shareTabVal={2
              }
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      const addToAppleCalendarButton = screen.getByText('Add to Apple Calendar');
      fireEvent.click(addToAppleCalendarButton);

      await waitFor(() => expect(mockOnClose).not.toHaveBeenCalled());
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('Interaction with child components', () => {
    it('passes correct props to TaskItem', () => {
      const mockOnClose = jest.fn();
      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={mockOnClose}
              selectedTask={mockTask}
              shareTabVal={0
              }
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      const taskItem = screen.getByRole('listitem');
      expect(taskItem).toHaveAttribute('features', '{"enableGlow":false}');
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: ShareDialog.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для ShareDialog
// ============================================
import renderer from 'react-test-renderer';
import { ShareDialog } from './ShareDialog';

describe('ShareDialog Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<ShareDialog />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Open State', () => {
    test('should match snapshot when open prop is true', () => {
      const tree = renderer.create(<ShareDialog open={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when open prop is false', () => {
      const tree = renderer.create(<ShareDialog open={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Selected Task', () => {
    test('should match snapshot when selectedTask is provided', () => {
      const task = {
        name: 'Test Task',
        deadline: '2023-10-10T12:00:00',
        category: 'Work',
        notes: 'This is a test note'
      };
      const tree = renderer.create(<ShareDialog selectedTask={task} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Share Tab Value', () => {
    test('should match snapshot when share tab value is 0', () => {
      const tree = renderer.create(<ShareDialog shareTabVal={0} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when share tab value is 1', () => {
      const tree = renderer.create(<ShareDialog shareTabVal={1} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when share tab value is 2 and apple device', () => {
      const tree = renderer.create(<ShareDialog shareTabVal={2} systemInfo={{ isAppleDevice: true }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error Scenarios', () => {
    test('should match snapshot when an error occurs during copy to clipboard', () => {
      const mockShowToast = jest.fn();
      const tree = renderer
        .create(
          <ShareDialog
            onClose={() => {}}
            selectedTask={{ name: 'Test Task' }}
            toasts={[{ id: 'copy-sharable-link', message: 'Error copying link to clipboard' }]}
            useToasterStore={() => ({
              showToast,
              toasts: ['copy-sharable-link'],
            })}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: ShareDialog.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для ShareDialog
// ============================================
Ниже представлен пример кода интеграционного теста для компонента `ShareDialog` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareDialog } from './path/to/share-dialog'; // путь к компоненту
import { UserContext } from '../../contexts/UserContext';
import { createMemoryContext } from 'react-contexify';

// Моки для сетевых запросов
const server = setupServer(
  rest.get('/tasks/:id', (req, res, ctx) => {
    const taskId = req.params.id;
    return res(ctx.json({ task: { id: taskId, name: 'Test Task' } }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Контекст пользователя
const mockUser = {
  settings: {},
  name: 'John Doe',
};

// Создаем память-контекст для UserContext
const MemoryContext = createMemoryContext(UserContext);

describe('ShareDialog Integration Tests', () => {
  it('should display task details when opened', async () => {
    render(
      <MemoryContext.Provider value={mockUser}>
        <ShareDialog open onClose={() => {}} selectedTask={{ id: 'test-task-id', name: 'Test Task' }} />
      </MemoryContext.Provider>,
    );

    expect(screen.queryByRole('heading', { name: 'Test Task' })).toBeInTheDocument(); // проверка заголовка задачи
    expect(screen.queryByLabelText('Shareable Link')).toBeInTheDocument(); // проверка наличия поля ссылки
    expect(screen.queryByLabelText('QR Code')).toBeInTheDocument(); // проверка наличия QR-кода
  });

  it('should copy link to clipboard successfully', async () => {
    render(
      <MemoryContext.Provider value={mockUser}>
        <ShareDialog open onClose={() => {}} selectedTask={{ id: 'test-task-id', name: 'Test Task' }} />
      </MemoryContext.Provider>,
    );

    // Имитация клика на кнопку копирования ссылки
    userEvent.click(screen.getByText('Copy'));

    // Ожидание завершения асинхронной операции
    await waitFor(() => expect(screen.queryByText('Copied link to clipboard.')).toBeInTheDocument());
  });

  it('should download QR code image', async () => {
    render(
      <MemoryContext.Provider value={mockUser}>
        <ShareDialog open onClose={() => {}} selectedTask={{ id: 'test-task-id', name: 'Test Task' }} />
      </MemoryContext.Provider>,
    );

    // Имитация клика на кнопку скачивания QR-кода
    userEvent.click(screen.getByText('Download QR Code'));

    // Ожидание завершения асинхронной операции
    await waitFor(() => expect(screen.queryByText('Download QR Code successful!')).toBeInTheDocument());
  });

  it('should add task to apple calendar', async () => {
    render(
      <MemoryContext.Provider value={mockUser}>
        <ShareDialog open onClose={() => {}} selectedTask={{ id: 'test-task-id', name: 'Test Task', deadline: '2023-10-10T12:00:00' }} />
      </MemoryContext.Provider>,
    );

    // Имитация клика на кнопку добавления в календарь
    userEvent.click(screen.getByText('Add to Apple Calendar'));

    // Ожидание завершения асинхронной операции
    await waitFor(() => expect(screen.queryByText('Event added to Apple Calendar!')).toBeInTheDocument());
  });
});
Этот пример демонстрирует базовую структуру интеграционного теста для компонента `ShareDialog`. В нем используются следующие шаги:

1. **Настройка MSW**: Используется для создания мок-сервера и имитации сетевых запросов.
2. **Контекст пользователя**: Создается память-контекст для предоставления данных о пользователе через `UserContext`.
3. **Тестирование отображения элементов**: Проверяется наличие необходимых элементов интерфейса.
4. **Имитация действий пользователя**: Пользовательские действия имитируются с помощью библиотеки `@testing-library/user-event`.
5. **Ожидание завершения асинхронных операций**: Для проверки корректности выполнения асинхронных операций используется метод `waitFor`.

Эти тесты проверяют основные функциональные возможности компонента, такие как отображение информации, копирование ссылок, скачивание QR-кодов и добавление задач в календари.
