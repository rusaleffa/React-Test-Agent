/**
 * Snapshot-тесты для проверки рендеринга для RenderTaskDescription
 * 
 * @file RenderTaskDescription.snapshot.test.tsx
 * @description Тестирование RenderTaskDescription 
 * @generated 2026-09-08T13:24:35.101Z
 * @type {snapshot}
 * @testCount 3
 * 
 * @dependencies @testing-library/react, react-test-renderer
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D react-test-renderer

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