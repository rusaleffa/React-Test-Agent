/**
 * Модульные тесты для изолированной проверки компонента для Component
 * 
 * @file Component.unit.test.tsx
 * @description Тестирование Component 
 * @generated 2026-09-08T13:21:09.575Z
 * @type {unit}
 * @testCount 3
 * 
 * @dependencies @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D @testing-library/jest-dom
// npm install -D @testing-library/user-event

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ShortcutItem } from '../ShortcutItem';

describe('ShortcutItem', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <ShortcutItem
          name="Test Name"
          keys={['Cmd', 'Shift', 'A']}
        />
      );

      expect(screen.getByText(/test name/i)).toBeInTheDocument();
      expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
      const keyComboElement = screen.getByText('⌘ShiftA');
      expect(keyComboElement).toBeInTheDocument();
    });

    it('should render with description prop', () => {
      render(
        <ShortcutItem
          name="Test Name"
          description="This is a test description"
          keys={['Cmd', 'Shift', 'A']}
        />
      );

      expect(screen.getByText(/test name/i)).toBeInTheDocument();
      expect(screen.getByText(/this is a test description/i)).toBeInTheDocument();
      expect(screen.getByText('⌘ShiftA')).toBeInTheDocument();
    });

    it('should handle empty keys array', () => {
      render(
        <ShortcutItem
          name="Test Name"
          keys=[]
        />
      );

      expect(screen.getByText(/test name/i)).toBeInTheDocument();
      expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
      expect(screen.queryByText('⌘')).not.toBeInTheDocument();
    });
  });
});