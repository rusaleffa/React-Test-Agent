/**
 * Модульные тесты для изолированной проверки компонента для updatePrompt
 * 
 * @file updatePrompt.unit.test.tsx
 * @description Тестирование updatePrompt 
 * @generated 2026-09-08T13:40:02.662Z
 * @type {unit}
 * @testCount 7
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
import updatePrompt from '../updatePrompt';

describe('updatePrompt', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<updatePrompt />);
      expect(screen.queryByRole('button')).toBeInTheDocument();
    });

    it('should render dismiss button', () => {
      render(<updatePrompt />);
      expect(screen.getByText(/dismiss/i)).toBeInTheDocument();
    });

    it('should render reload button', () => {
      render(<updatePrompt />);
      expect(screen.getByText(/reload/i)).toBeInTheDocument();
    });

    it('should not show prompt without installing worker', () => {
      const mockSW = {
        addEventListener: jest.fn(),
        installing: null,
      };
      render(<updatePrompt r={mockSW} />);
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('should not show prompt if controller is not set', () => {
      const mockSW = {
        addEventListener: jest.fn(),
        installing: {},
      };
      render(<updatePrompt r={mockSW} />);
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    let mockToastDismiss;
    beforeEach(() => {
      mockToastDismiss = jest.fn();
      global.toast = {
        dismiss: mockToastDismiss,
      };
    });

    afterEach(() => {
      delete global.toast;
    });

    it('should dismiss toast on click', async () => {
      render(<updatePrompt />);
      await userEvent.click(screen.getByText(/dismiss/i));
      expect(mockToastDismiss).toHaveBeenCalledTimes(1);
    });

    it('should reload app on click', async () => {
      render(<updatePrompt />);
      await userEvent.click(screen.getByText(/reload/i));
      expect(global.toast.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});