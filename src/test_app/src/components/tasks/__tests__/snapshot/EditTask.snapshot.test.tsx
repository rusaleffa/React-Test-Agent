/**
 * Snapshot-тесты для проверки рендеринга для EditTask
 * 
 * @file EditTask.snapshot.test.tsx
 * @description Тестирование EditTask 
 * @generated 2026-09-08T13:24:12.662Z
 * @type {snapshot}
 * @testCount 10
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