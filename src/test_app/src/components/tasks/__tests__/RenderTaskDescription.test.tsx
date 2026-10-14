import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TaskContext } from '../../contexts/TaskContext';
import RenderTaskDescription from '../RenderTaskDescription';

const mockTask = {
  id: 'test-id',
  description: 'This is a test description with http://example.com and https://example.org',
  color: '#ff0000'
};

const mockToggleShowMore = jest.fn();
jest.mock('../../contexts/TaskContext', () => ({
  useContext: () => ({
    expandedTasks: ['test-id'],
    toggleShowMore
  })
}));

describe('RenderTaskDescription', () => {
  describe('Рендеринг', () => {
    it('should render without description', () => {
      render(<RenderTaskDescription task={mockTask} />);
      expect(screen.queryByText(/this is a test description/i)).toBeNull();
    });

    it('should render with short description', () => {
      mockTask.description = 'short desc';
      render(<RenderTaskDescription task={mockTask} />);
      expect(screen.getByText(/short desc/i)).toBeInTheDocument();
    });

    it('should render with long description', () => {
      mockTask.description = 'long description that exceeds limit';
      render(<RenderTaskDescription task={mockTask} />);
      expect(screen.getByText(/.../i)).toBeInTheDocument();
    });

    it('should render with more button', () => {
      render(<RenderTaskDescription task={mockTask} enableMoreButton={true} />);
      expect(screen.getByText(/show more/i)).toBeInTheDocument();
      userEvent.click(screen.getByText(/show more/i));
      expect(mockToggleShowMore).toHaveBeenCalledWith('test-id');
    });

    it('should not render more button when no description', () => {
      mockTask.description = '';
      render(<RenderTaskDescription task={mockTask} enableMoreButton={true} />);
      expect(screen.queryByText(/show more/i)).toBeNull();
    });

    it('should handle invalid URLs', () => {
      mockTask.description = 'invalid url: abcdefg';
      render(<RenderTaskDescription task={mockTask} />);
      expect(screen.getByText(/abcdefg/i)).toBeInTheDocument();
    });
  });

  describe('Взаимодействие с дочерними компонентами', () => {
    it('should pass correct props to DescriptionLink', () => {
      render(<RenderTaskDescription task={mockTask} />);
      const linkElement = screen.getByRole('link', { name: /example/i });
      expect(linkElement.getAttribute('href')).toEqual('http://example.com');
      expect(linkElement.getAttribute('rel')).toEqual('noreferrer');
      expect(linkElement.target).toEqual('_blank');
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: RenderTaskDescription.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для RenderTaskDescription
// ============================================
import renderer from 'react-test-renderer';
import { Task } from '../../types/user';
import { TaskContext } from '../../contexts/TaskContext';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Mock store configuration
const mockStore = configureStore([thunk]);

describe('RenderTaskDescription Snapshot Tests', () => {
  const initialState = {
    expandedTasks: [],
  };

  const task: Task = {
    id: 'test-id',
    description: 'This is a long description that needs to be shown more or less depending on the state.',
    done: false,
    color: '#ff0000',
  };

  const mockTaskContext = {
    expandedTasks: ['test-id'],
    toggleShowMore: jest.fn(),
  };

  test('should match snapshot with default props and no expansion', () => {
    const tree = renderer.create(
      <Provider store={mockStore(initialState)}>
        <TaskContext.Provider value={mockTaskContext}>
          <RenderTaskDescription task={task} />
        </TaskContext.Provider>
      </Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when showing more content', () => {
    const { queryByText } = render(
      <Provider store={mockStore(initialState)}>
        <TaskContext.Provider value={mockTaskContext}>
          <RenderTaskDescription task={task} />
        </TaskContext.Provider>
      </Provider>,
    );

    fireEvent.click(queryByText(/show more/i));

    const tree = renderer.create(
      <Provider store={mockStore(initialState)}>
        <TaskContext.Provider value={{
          ...mockTaskContext,
          expandedTasks: ['test-id']
        }}>
          <RenderTaskDescription task={task} />
        </TaskContext.Provider>
      </Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when showing less content', () => {
    const { queryByText } = render(
      <Provider store={mockStore({
        expandedTasks: ['test-id']
      })}
      >
        <TaskContext.Provider value={mockTaskContext}>
          <RenderTaskDescription task={task} />
        </TaskContext.Provider>
      </Provider>,
    );

    fireEvent.click(queryByText(/show less/i));

    const tree = renderer.create(
      <Provider store={mockStore({
        expandedTasks: []
      })}
      >
        <TaskContext.Provider value={{
          ...mockTaskContext,
          expandedTasks: []
        }}>
          <RenderTaskDescription task={task} />
        </TaskContext.Provider>
      </Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: RenderTaskDescription.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для RenderTaskDescription
// ============================================
Вот пример кода интеграционного теста для компонента `RenderTaskDescription`:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskContextProvider } from '../../contexts/TaskContext'; // Предположим, что TaskContext существует
import { RenderTaskDescription } from './RenderTaskDescription';

// Моки сервер API
const server = setupServer(
  rest.get('/tasks/:id', (req, res, ctx) => {
    const taskId = req.params.id;
    const mockTask = {
      id: taskId,
      description: `This is a long description that needs truncation or showing more...`,
      color: '#ff0000',
    };
    return res(ctx.json(mockTask));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('RenderTaskDescription Integration Tests', () => {
  it('renders correctly with short description', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id' }} />
      </TaskContextProvider>,
    );

    expect(screen.queryByText(/This is a long description/i)).toBeNull();
  });

  it('truncates long description and shows "show more" button', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id', description: 'long description...' }} />
      </TaskContextProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/long description/i)).not.toBeNull();
      expect(screen.queryByText(/show more/i)).toBeTruthy();
    });
  });

  it('shows full description when clicking "show more"', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id', description: 'long description...' }} />
      </TaskContextProvider>,
    );

    userEvent.click(screen.getByText(/show more/i));

    await waitFor(() => {
      expect(screen.queryByText(/long description/i)).toBeInTheDocument();
      expect(screen.queryByText(/show less/i)).toBeTruthy();
    });
  });

  it('hides "show more" button after expanding', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id', description: 'long description...' }} />
      </TaskContextProvider>,
    );

    userEvent.click(screen.getByText(/show more/i));

    await waitFor(() => {
      expect(screen.queryByText(/show more/i)).toBeNull();
      expect(screen.queryByText(/show less/i)).toBeInTheDocument();
    });
  });

  it('handles empty description', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id', description: '' }} />
      </TaskContextProvider>,
    );

    expect(screen.queryByText(/no description/i)).toBeNull();
  });

  it('handles missing description', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id' }} />
      </TaskContextProvider>,
    );

    expect(screen.queryByText(/no description/i)).toBeInTheDocument();
  });
});
Этот набор тестов проверяет следующие сценарии:

- Корректное отображение короткого описания без кнопки «показать больше».
- Отображение укороченного описания и наличие кнопки «показать больше» при длинном описании.
- Переход от краткого к полному описанию после нажатия на кнопку «показать больше».
- Скрытие кнопки «показать больше», когда описание полностью раскрыто.
- Отсутствие текста в случае отсутствия описания.
- Отсутствие текста в случае пустого описания.

Обратите внимание, что тесты предполагают наличие контекста `TaskContext`, который должен быть настроен соответствующим образом перед рендерингом компонента.
