/**
 * Snapshot-тесты для проверки рендеринга для ShareDialog
 * 
 * @file ShareDialog.snapshot.test.tsx
 * @description Тестирование ShareDialog 
 * @generated 2026-09-08T13:25:03.053Z
 * @type {snapshot}
 * @testCount 8
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