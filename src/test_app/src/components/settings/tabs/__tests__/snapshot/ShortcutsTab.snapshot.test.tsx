/**
 * Snapshot-тесты для проверки рендеринга для ShortcutsTab
 * 
 * @file ShortcutsTab.snapshot.test.tsx
 * @description Тестирование ShortcutsTab 
 * @generated 2026-09-08T13:23:41.952Z
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
import { systemInfo } from '../../../utils'; // Предположим, что этот модуль доступен и настроен корректно

// Настройка mock systemInfo для тестирования на разных платформах
jest.mock('../../../utils');
systemInfo.isAppleDevice = true; // Для macOS
systemInfo.isAppleDevice = false; // Для Windows или Linux

describe('ShortcutsTab Snapshot Tests', () => {
  test('should match snapshot for default props on macOS', () => {
    systemInfo.isAppleDevice = true;
    const tree = renderer.create(<ShortcutsTab />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot for default props on non-macOS platforms', () => {
    systemInfo.isAppleDevice = false;
    const tree = renderer.create(<ShortcutsTab />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});