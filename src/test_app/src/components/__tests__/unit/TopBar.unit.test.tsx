/**
 * Модульные тесты для изолированной проверки компонента для TopBar
 * 
 * @file TopBar.unit.test.tsx
 * @description Тестирование TopBar 
 * @generated 2026-09-08T13:19:30.961Z
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
import TopBar from '../TopBar';

describe('TopBar', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<TopBar title="Default Title" />);
      expect(screen.getByRole('button')).toHaveTextContent('arrow_back_ios_new');
      expect(screen.getByText(/default title/i)).toBeInTheDocument();
    });

    it('should render with custom title prop', () => {
      render(<TopBar title="Custom Title" />);
      expect(screen.getByText(/custom title/i)).toBeInTheDocument();
    });

    it('should handle click event', () => {
      render(<TopBar title="Test Title" />);
      userEvent.click(screen.getByRole('button'));
      expect(userEvent.getURL()).toEqual('/');
    });
  });
});