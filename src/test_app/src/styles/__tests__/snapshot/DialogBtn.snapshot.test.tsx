/**
 * Snapshot-тесты для проверки рендеринга для DialogBtn
 * 
 * @file DialogBtn.snapshot.test.tsx
 * @description Тестирование DialogBtn 
 * @generated 2026-09-08T13:37:44.517Z
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
import { DialogBtn } from './DialogBtn'; // Импортируйте компонент здесь

describe('DialogBtn Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<DialogBtn />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Custom Props', () => {
    const customProps = {
      variant: 'outlined',
      startIcon: <PathName>{'test'}</PathName>,
      endIcon: <VisuallyHiddenInput type="hidden" name="input" />,
      disabled: true,
      fullWidth: true,
      color: 'secondary',
      size: 'large'
    };

    test('should match snapshot with custom props', () => {
      const tree = renderer.create(<DialogBtn {...customProps} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    test('should match snapshot in error state', () => {
      const tree = renderer.create(
        <DialogBtn error>
          <PathName>{'error message'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match snapshot in loading state', () => {
      const tree = renderer.create(
        <DialogBtn loading>
          <PathName>{'loading...'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Disabled State', () => {
    test('should match snapshot in disabled state', () => {
      const tree = renderer.create(
        <DialogBtn disabled>
          <PathName>{'disabled'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Full Width', () => {
    test('should match snapshot when fullWidth is true', () => {
      const tree = renderer.create(
        <DialogBtn fullWidth>
          <PathName>{'full width'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Custom Size', () => {
    test('should match snapshot when size is large', () => {
      const tree = renderer.create(
        <DialogBtn size='large'>
          <PathName>{'large size'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Custom Colors', () => {
    test('should match snapshot with secondary color', () => {
      const tree = renderer.create(
        <DialogBtn color='secondary'>
          <PathName>{'secondary color'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with primary color', () => {
      const tree = renderer.create(
        <DialogBtn color='primary'>
          <PathName>{'primary color'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Start and End Icons', () => {
    test('should match snapshot with start and end icons', () => {
      const tree = renderer.create(
        <DialogBtn startIcon={<PathName>{'start icon'}</PathName>}
                   endIcon={<PathName>{'end icon'}</PathName>}>
          <PathName>{'with icons'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});