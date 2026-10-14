/**
 * Snapshot-тесты для проверки рендеринга для TaskDetails
 * 
 * @file TaskDetails.snapshot.test.tsx
 * @description Тестирование TaskDetails 
 * @generated 2026-09-08T13:35:08.967Z
 * @type {snapshot}
 * @testCount 2
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
import { MemoryRouter } from 'react-router-dom';
import TaskDetails from './TaskDetails';
import { UserContext } from '../contexts/UserContext';
import { createUserContext } from '../__mocks__/UserContext.mock';

// Mock the context provider for testing purposes
const mockUserContext = createUserContext({
  tasks: [
    {
      id: '1',
      name: 'Test Task',
      description: 'This is a test task',
      color: '#ff0000',
      date: '2023-09-15T10:00:00Z',
      lastSave: '2023-09-15T10:00:00Z',
      deadline: '2023-09-20T10:00:00Z',
      done: true,
      pinned: false,
      sharedBy: 'John Doe',
      category: ['Work'],
      emoji: ':smile:'
    },
  ],
  emojisStyle: {},
});

describe('TaskDetails Snapshot Tests', () => {
  it('should match snapshot with valid task data', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={mockUserContext}>
            <TaskDetails />
          </UserContext.Provider>
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when task does not exist', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={mockUserContext}>
            <TaskDetails />
          </UserContext.Provider>
        </MemoryRouter>,
        // Passing an invalid ID that should trigger the not-found component
        { params: { id: 'invalid-id' } }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});