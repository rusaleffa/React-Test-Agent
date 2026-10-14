/**
 * Snapshot-тесты для проверки рендеринга для SettingsDialog
 * 
 * @file SettingsDialog.snapshot.test.tsx
 * @description Тестирование SettingsDialog 
 * @generated 2026-09-08T13:20:49.970Z
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
import { SettingsDialog } from './SettingsDialog';

describe('SettingsDialog Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<SettingsDialog />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Open State', () => {
    test('should match snapshot when open prop is true', () => {
      const tree = renderer.create(<SettingsDialog open />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when open prop is false', () => {
      const tree = renderer.create(<SettingsDialog open={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match snapshot during loading state', () => {
      const tree = renderer.create(
        <SettingsDialog open loading={true}>
          <CircularProgress size={48} />
        </SettingsDialog>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    test('should match snapshot when error occurs', () => {
      const tree = renderer.create(
        <SettingsDialog open error={new Error('Test Error')} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Different Themes', () => {
    test('should match snapshot in light mode', () => {
      const tree = renderer.create(
        <SettingsDialog open>
          <SettingsDialog />
        </SettingsDialog>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot in dark mode', () => {
      const tree = renderer.create(
        <SettingsDialog open>
          <SettingsDialog />
        </SettingsDialog>, {
          createNodeMock: () => ({
            ...document.createElement('html'),
            classList: {
              add: () => {},
              contains: () => true,
            },
          })
        }
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});