/**
 * Модульные тесты для изолированной проверки компонента для ShortcutsTab
 * 
 * @file ShortcutsTab.unit.test.tsx
 * @description Тестирование ShortcutsTab 
 * @generated 2026-09-08T13:23:41.951Z
 * @type {unit}
 * @testCount 6
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
import { systemInfo } from '../../../utils';
import ShortcutItem from '../ShortcutItem';
import ShortcutsTab from '../ShortcutsTab';

jest.mock('../../../utils');

const mockSystemInfo = {
  isAppleDevice: true,
};
systemInfo.isAppleDevice = jest.fn().mockReturnValue(mockSystemInfo.isAppleDevice);

describe('ShortcutsTab', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<ShortcutsTab />);
      expect(screen.getByText(/quick export/i)).toBeInTheDocument();
      expect(screen.getByText(/save all tasks and download as json file/i)).toBeInTheDocument();
      expect(screen.getByText(/quick search/i)).toBeInTheDocument();
      expect(screen.getByText(/focus search input/i)).toBeInTheDocument();
      expect(screen.getByText(/print tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/print the current task list/i)).toBeInTheDocument();
      expect(screen.getByText(/toggle theme/i)).toBeInTheDocument();
      expect(screen.getByText(/switch between light and dark mode/i)).toBeInTheDocument();
    });

    it('should render shortcut items correctly', () => {
      render(<ShortcutsTab />);
      const shortcutItems = screen.getAllByRole('listitem');
      expect(shortcutItems.length).toEqual(4);
      expect(shortcutItems[0].textContent).toMatch(/quick export/i);
      expect(shortcutItems[1].textContent).toMatch(/quick search/i);
      expect(shortcutItems[2].textContent).toMatch(/print tasks/i);
      expect(shortcutItems[3].textContent).toMatch(/toggle theme/i);
    });

    it('should display correct key combinations for Cmd/S', () => {
      render(<ShortcutsTab />);
      const quickExportElement = screen.getByText(/quick export/i);
      expect(quickExportElement.textContent).toContain("Cmd+S");
    });

    it('should display correct key combinations for Ctrl/P', () => {
      render(<ShortcutsTab />);
      const printTasksElement = screen.getByText(/print tasks/i);
      expect(printTasksElement.textContent).toContain("Ctrl+P");
    });

    it('should display correct key combinations for Ctrl+Shift+L', () => {
      render(<ShortcutsTab />);
      const toggleThemeElement = screen.getByText(/toggle theme/i);
      expect(toggleThemeElement.textContent).toContain("Ctrl+Shift+L");
    });
  });

  describe('Interaction with children components', () => {
    it('should pass correct props to ShortcutItem', () => {
      render(<ShortcutsTab />);
      const shortcutItems = screen.getAllByRole('listitem');
      expect(shortcutItems.length).toEqual(4);
      expect(shortcutItems[0]).toHaveAttribute('name', 'Quick Export');
      expect(shortcutItems[0]).toHaveAttribute('description', 'Save all tasks and download as JSON file');
      expect(shortcutItems[0]).toHaveAttribute('keys', '[Cmd,S]');
      expect(shortcutItems[1]).toHaveAttribute('name', 'Quick Search');
      expect(shortcutItems[1]).toHaveAttribute('description', 'Focus search input');
      expect(shortcutItems[1]).toHaveAttribute('keys', '[Cmd,/]');
      expect(shortcutItems[2]).toHaveAttribute('name', 'Print Tasks');
      expect(shortcutItems[2]).toHaveAttribute('description', 'Print the current task list');
      expect(shortcutItems[2]).toHaveAttribute('keys', '[Ctrl,P]');
      expect(shortcutItems[3]).toHaveAttribute('name', 'Toggle Theme');
      expect(shortcutItems[3]).toHaveAttribute('description', 'Switch between light and dark mode');
      expect(shortcutItems[3]).toHaveAttribute('keys', '[Ctrl,Shift,L]');
    });
  });
});