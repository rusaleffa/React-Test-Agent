/**
 * Модульные тесты для изолированной проверки компонента для CustomDialogTitle
 * 
 * @file CustomDialogTitle.unit.test.tsx
 * @description Тестирование CustomDialogTitle 
 * @generated 2026-09-07T22:44:48.144Z
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
import { CloseRounded } from '@mui/icons-material';
import CustomDialogTitle from '../CustomDialogTitle';

describe('CustomDialogTitle', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <CustomDialogTitle title="Test Title" />
      );
      expect(screen.getByText(/test title/i)).toBeInTheDocument();
    });

    it('should render with custom subTitle', () => {
      render(
        <CustomDialogTitle title="Test Title" subTitle="Test SubTitle" />
      );
      expect(screen.getByText(/test subtitle/i)).toBeInTheDocument();
    });

    it('should render with icon prop', () => {
      const iconElement = <CloseRounded />;
      render(
        <CustomDialogTitle title="Test Title" icon={iconElement} />
      );
      expect(screen.queryByRole('button')).toBeInTheDocument();
    });

    it('should not render divider if removeDivider is true', () => {
      render(
        <CustomDialogTitle title="Test Title" removeDivider />
      );
      expect(screen.queryByRole('divider')).not.toBeInTheDocument();
    });

    it('should call onClose when close button clicked', () => {
      const mockOnClose = jest.fn();
      render(
        <CustomDialogTitle title="Test Title" onClose={mockOnClose} />
      );
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});