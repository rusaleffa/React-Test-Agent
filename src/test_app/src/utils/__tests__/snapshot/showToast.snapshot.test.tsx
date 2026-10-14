/**
 * Snapshot-тесты для проверки рендеринга для showToast
 * 
 * @file showToast.snapshot.test.tsx
 * @description Тестирование showToast 
 * @generated 2026-09-08T13:39:41.666Z
 * @type {snapshot}
 * @testCount 12
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
import { PriorityHighRounded } from '@mui/icons-material';
import { ToastIconWrapper } from '../styles';
import { ColorPalette } from '../theme/themeConfig';

describe('showToast Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<showToast />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Success Toast', () => {
    test('should match snapshot with success toast', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Success Message</span>}
          type="success"
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error Toast', () => {
    test('should match snapshot with error toast', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Error Message</span>}
          type="error"
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading Toast', () => {
    test('should match snapshot with loading toast', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Loading...</span>}
          type="loading"
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Warning Toast', () => {
    test('should match snapshot with warning toast', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Warning Message</span>}
          type="warning"
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Info Toast', () => {
    test('should match snapshot with info toast', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Info Message</span>}
          type="info"
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Custom Type Warning', () => {
    test('should match snapshot with custom type warning', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Custom Warning Message</span>}
          type="custom"
          style={{
            borderColor: ColorPalette.orange,
          }}
          icon={
            <ToastIconWrapper bgColor={ColorPalette.orange}>
              <PriorityHighRounded />
            </ToastIconWrapper>
          }
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Custom Type Info', () => {
    test('should match snapshot with custom type info', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Custom Info Message</span>}
          type="custom"
          style={{
            borderColor: ColorPalette.blue,
          }}
          icon={
            <ToastIconWrapper bgColor={ColorPalette.blue}>
              <PriorityHighRounded sx={{ transform: 'rotate(180deg)' }} />
            </ToastIconWrapper>
          }
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Disable Click Dismiss', () => {
    test('should match snapshot with disable click dismiss', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Message</span>}
          type="success"
          disableClickDismiss
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Disable Vibrate', () => {
    test('should match snapshot with disable vibrate', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Message</span>}
          type="success"
          disableVibrate
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Dismiss Button', () => {
    test('should match snapshot with dismiss button', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Message</span>}
          type="success"
          dismissButton
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Prevent Duplicate', () => {
    test('should match snapshot with prevent duplicate', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Message</span>}
          type="success"
          preventDuplicate
          id="test-id"
          visibleToasts={[{ id: 'other-id' }]}
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});