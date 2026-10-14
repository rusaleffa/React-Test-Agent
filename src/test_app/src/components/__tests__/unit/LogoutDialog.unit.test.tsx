/**
 * Модульные тесты для изолированной проверки компонента для LogoutDialog
 * 
 * @file LogoutDialog.unit.test.tsx
 * @description Тестирование LogoutDialog 
 * @generated 2026-09-07T22:46:29.520Z
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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LogoutDialog from '../LogoutDialog';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { CustomDialogTitle } from './DialogTitle';
import { DialogBtn } from '../styles';
import { Logout } from '@mui/icons-material';
import { UserContext } from '../contexts/UserContext';
import { defaultUser } from '../constants/defaultUser';
import { deleteProfilePictureFromDB, showToast } from '../utils';

const mockSetUser = jest.fn();
jest.mock('../contexts/UserContext', () => ({
  useContext: () => ({ setUser }),
}));

const mockDeleteProfilePictureFromDB = jest.fn();
jest.mock('../utils', () => ({
  deleteProfilePictureFromDB: mockDeleteProfilePictureFromDB,
  showToast: jest.fn(),
}));

describe('LogoutDialog', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<LogoutDialog open={true} onClose={() => {}} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /logout confirmation/i }));
      expect(screen.getByText(/are you sure you want to logout/i));
      expect(screen.getAllByRole('button').length).toEqual(2);
      expect(mockSetUser).not.toHaveBeenCalled();
    });

    it('should render with custom props', () => {
      render(
        <LogoutDialog
          open={false}
          onClose={() => {}}
          title="Test Title"
          message="Test Message"
        />
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    let onCloseMock;
    beforeEach(() => {
      onCloseMock = jest.fn();
    });

    it('should close dialog when cancel button is clicked', () => {
      render(<LogoutDialog open={true} onClose={onCloseMock} />);
      userEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should log out and close dialog when confirm button is clicked', async () => {
      render(<LogoutDialog open={true} onClose={onCloseMock} />);
      userEvent.click(screen.getByRole('button', { name: /logout/i }));
      await Promise.resolve(); // simulate async operations
      expect(mockSetUser).toHaveBeenCalledWith(defaultUser);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(mockDeleteProfilePictureFromDB).toHaveBeenCalled();
      expect(showToast).toHaveBeenCalledWith('You have been successfully logged out');
    });
  });

  describe('Взаимодействие с дочерними компонентами', () => {
    it('should pass correct props to child components', () => {
      render(<LogoutDialog open={true} onClose={() => {}} />);
      const dialogTitle = screen.getByRole('heading', { name: /logout confirmation/i });
      expect(dialogTitle.props.icon.type).toEqual(Logout);
      const dialogContent = screen.getByText(/are you sure you want to logout/i);
      expect(dialogContent.parentElement.closest(DialogContent)).toBeDefined();
      const dialogButtons = screen.getAllByRole('button');
      expect(dialogButtons.length).toEqual(2);
      expect(dialogButtons[0].textContent.trim()).toEqual('Cancel');
      expect(dialogButtons[1].textContent.trim()).toContain('Logout');
    });
  });
});

// Дополнительные моки или настройки можно добавить здесь, если потребуется