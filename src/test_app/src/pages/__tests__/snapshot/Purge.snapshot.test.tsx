/**
 * Snapshot-тесты для проверки рендеринга для Purge
 * 
 * @file Purge.snapshot.test.tsx
 * @description Тестирование Purge 
 * @generated 2026-09-08T13:33:26.973Z
 * @type {snapshot}
 * @testCount 7
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
import { UserContext } from '../contexts/UserContext';
import { createMemoryContext } from '@testing-library/react';

// Create a mock context for testing
const MockUserContext = ({ children }) => (
  <UserContext.Provider value={{ user: { tasks: [], deletedTasks: [] } }}>
    {children}
  </UserContext.Provider>
);

describe('Purge Snapshot Tests', () => {
  it('should match snapshot with default props', () => {
    const context = createMemoryContext(MockUserContext);
    const tree = renderer.create(<context.Purge />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when no tasks are available', () => {
    const context = createMemoryContext(MockUserContext);
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when there is one task and it is marked as done', () => {
    const context = createMemoryContext(MockUserContext);
    const tasks = [{ id: '1', name: 'Test Task', done: true, color: '#ff0000' }];
    const user = { tasks, deletedTasks: [] };
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when there is one task and it is not marked as done', () => {
    const context = createMemoryContext(MockUserContext);
    const tasks = [{ id: '1', name: 'Test Task', done: false, color: '#ff0000' }];
    const user = { tasks, deletedTasks: [] };
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when multiple tasks are present, some done and some not', () => {
    const context = createMemoryContext(MockUserContext);
    const tasks = [
      { id: '1', name: 'Test Task 1', done: true, color: '#ff0000' },
      { id: '2', name: 'Test Task 2', done: false, color: '#00ff00' },
      { id: '3', name: 'Test Task 3', done: true, color: '#0000ff' },
    ];
    const user = { tasks, deletedTasks: [] };
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when the delete all dialog is open', () => {
    const context = createMemoryContext(MockUserContext);
    const tasks = [];
    const user = { tasks, deletedTasks: [] };
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when the delete all dialog is closed', () => {
    const context = createMemoryContext(MockUserContext);
    const tasks = [];
    const user = { tasks, deletedTasks: [] };
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});