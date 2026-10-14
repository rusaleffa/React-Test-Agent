/**
 * Модульные тесты для изолированной проверки компонента для MainLayout
 * 
 * @file MainLayout.unit.test.tsx
 * @description Тестирование MainLayout 
 * @generated 2026-09-08T13:30:27.564Z
 * @type {unit}
 * @testCount 2
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
import MainLayout from './MainLayout';  

describe('MainLayout', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<MainLayout />);
      
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // Проверяем наличие навигации
      expect(screen.getByRole('presentation')).toHaveStyle({marginTop: '128px'}); // Проверяем отступ сверху
      expect(screen.getByRole('tablist')).toBeInTheDocument(); // Проверяем футер
    });
    
    it('should render children correctly', () => {
      const childComponent = <div data-testid="child">Child Component</div>;
      render(<MainLayout>{childComponent}</MainLayout>);

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });
});