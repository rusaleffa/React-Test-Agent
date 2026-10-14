/**
 * Snapshot-тесты для проверки рендеринга для updatePrompt
 * 
 * @file updatePrompt.snapshot.test.tsx
 * @description Тестирование updatePrompt 
 * @generated 2026-09-08T13:40:02.664Z
 * @type {snapshot}
 * @testCount 4
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
import { Toast } from 'react-hot-toast';
import { Stack, Typography } from '@mui/material';
import UpdateRounded from '@mui/icons-material/UpdateRounded';
import { updatePrompt } from './updatePrompt'; // Подставьте путь к вашему компоненту

// Имитация объекта Toast из react-hot-toast
const mockToast = {
  dismiss: jest.fn(),
  id: 'test-id',
};

jest.mock('react-hot-toast', () => ({
  toast: (cb) => cb(mockToast),
}));

describe('updatePrompt Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer.create(<updatePrompt />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with dismissed toast', () => {
    const tree = renderer.create(<updatePrompt />).toJSON(); // Повторно рендерим, чтобы получить обновленный UI
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with reload button clicked', () => {
    const tree = renderer.create(
      <updatePrompt />,
    ).toJSON();
    // Имитация клика на кнопку "Reload"
    tree.findWhere(node => node.type === 'Button' && node.props.children.includes('Reload')).props.onClick();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with dismiss button clicked', () => {
    const tree = renderer.create(
      <updatePrompt />,
    ).toJSON();
    // Имитация клика на кнопку "Dismiss"
    tree.findWhere(node => node.type === 'Button' && node.props.children.includes('Dismiss')).props.onClick();
    expect(tree).toMatchSnapshot();
  });
});