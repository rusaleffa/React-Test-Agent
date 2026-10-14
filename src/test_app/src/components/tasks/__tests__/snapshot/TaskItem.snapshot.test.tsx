/**
 * Snapshot-тесты для проверки рендеринга для TaskItem
 * 
 * @file TaskItem.snapshot.test.tsx
 * @description Тестирование TaskItem 
 * @generated 2026-09-08T13:25:44.626Z
 * @type {snapshot}
 * @testCount 15
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