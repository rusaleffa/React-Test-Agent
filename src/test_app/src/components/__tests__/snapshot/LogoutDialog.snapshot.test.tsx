/**
 * Snapshot-тесты для проверки рендеринга для LogoutDialog
 * 
 * @file LogoutDialog.snapshot.test.tsx
 * @description Тестирование LogoutDialog 
 * @generated 2026-09-07T22:46:29.521Z
 * @type {snapshot}
 * @testCount 6
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
import { LogoutDialog } from './LogoutDialog';

describe('LogoutDialog Snapshot Tests', () => {
  // Базовый случай с открытыми пропсами
  test('should match snapshot with default props', () => {
    const tree = renderer.create(<LogoutDialog open={true} onClose={() => {}} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай закрытого диалога
  test('should match snapshot when closed', () => {
    const tree = renderer.create(<LogoutDialog open={false} onClose={() => {}} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай без иконки и заголовка
  test('should match snapshot without title and icon', () => {
    const tree = renderer.create(
      <LogoutDialog open={true} onClose={() => {}}>
        <DialogContent>
          Content without title or icon
        </DialogContent>
      </LogoutDialog>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай с кастомным заголовком и иконкой
  test('should match snapshot with custom title and icon', () => {
    const tree = renderer.create(
      <LogoutDialog open={true} onClose={() => {}}>
        <CustomDialogTitle title="Custom Title" onClose={() => {}} icon={<Logout />}
      </CustomDialogTitle>
      <DialogContent>
        Content with custom title and icon
      </DialogContent>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай с ошибочным состоянием
  test('should match snapshot in error state', () => {
    const tree = renderer.create(
      <LogoutDialog open={true} onClose={() => {}}>
        <DialogContent>
          Error message here
        </DialogContent>
      </LogoutDialog>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай с загрузочным состоянием
  test('should match snapshot in loading state', () => {
    const tree = renderer.create(
      <LogoutDialog open={true} onClose={() => {}}>
        <DialogContent>
          Loading...
        </DialogContent>
      </LogoutDialog>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});