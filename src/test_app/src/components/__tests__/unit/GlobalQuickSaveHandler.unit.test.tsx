/**
 * Модульные тесты для изолированной проверки компонента для GlobalQuickSaveHandler
 * 
 * @file GlobalQuickSaveHandler.unit.test.tsx
 * @description Тестирование GlobalQuickSaveHandler 
 * @generated 2026-09-07T22:45:55.417Z
 * @type {unit}
 * @testCount 5
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
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GlobalQuickSaveHandler from '../GlobalQuickSaveHandler';
import { Dialog, DialogContent, DialogActions, Typography } from '@mui/material';
import { CustomDialogTitle } from '.';
import { DialogBtn } from '../styles';
import { SaveAltRounded } from '@mui/icons-material';
import { UserContext } from '../contexts/UserContext';
import { exportTasksToJson } from '../utils';
import { useTheme } from '@emotion/react';
import { useSystemTheme } from '../hooks/useSystemTheme';
import { isDarkMode } from '../utils/colorUtils';

const mockUser = {
  user: {
    darkmode: 'light',
  },
  setUser: jest.fn(),
};

const mockExportTasksToJson = jest.fn();
jest.mock('../utils', () => ({
  exportTasksToJson: mockExportTasksToJson,
}));

const MockChildComponent = () => <div data-testid="child-component">Child Component</div>;

describe('GlobalQuickSaveHandler', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <GlobalQuickSaveHandler>
            <MockChildComponent />
          </GlobalQuickSaveHandler>
        </UserContext.Provider>,
      );

      expect(screen.getByTestId('child-component')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render dialog when key combination pressed', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <GlobalQuickSaveHandler>
            <MockChildComponent />
          </GlobalQuickSaveHandler>
        </UserContext.Provider>,
      );

      userEvent.type(screen.getByTestId('child-component'), '{cmd}s');

      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    it('should not render dialog when shift+key combination pressed', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <GlobalQuickSaveHandler>
            <MockChildComponent />
          </GlobalQuickSaveHandler>
        </UserContext.Provider>,
      );

      userEvent.type(screen.getByTestId('child-component'), '{shift}{cmd}s');

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should close dialog and call handleClose false when cancel button clicked', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <GlobalQuickSaveHandler>
            <MockChildComponent />
          </GlobalQuickSaveHandler>
        </UserContext.Provider>,
      );

      userEvent.type(screen.getByTestId('child-component'), '{cmd}s');

      const dialog = screen.getByRole('dialog');
      const cancelButton = screen.getByText(/cancel/i);

      fireEvent.click(cancelButton);

      expect(mockUser.setUser).not.toHaveBeenCalled();
      expect(dialog.close).toHaveBeenCalledTimes(1);
      expect(mockExportTasksToJson).not.toHaveBeenCalled();
    });

    it('should close dialog and call handleClose true when save button clicked', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <GlobalQuickSaveHandler>
            <MockChildComponent />
          </GlobalQuickSaveHandler>
        </UserContext.Provider>,
      );

      userEvent.type(screen.getByTestId('child-component'), '{cmd}s');

      const dialog = screen.getByRole('dialog');
      const saveButton = screen.getByText(/save/i);

      fireEvent.click(saveButton);

      expect(mockUser.setUser).not.toHaveBeenCalled();
      expect(dialog.close).toHaveBeenCalledTimes(1);
      expect(mockExportTasksToJson).toHaveBeenCalled();
    });
  });
});