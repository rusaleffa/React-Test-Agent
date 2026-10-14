/**
 * Модульные тесты для изолированной проверки компонента для showToast
 * 
 * @file showToast.unit.test.tsx
 * @description Тестирование showToast 
 * @generated 2026-09-08T13:39:41.665Z
 * @type {unit}
 * @testCount 9
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
import showToast from '../src/utils/showToast';

describe('showToast', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<showToast message="Test Message" type="success" />);
      expect(screen.getByText(/test message/i)).toBeInTheDocument();
    });

    it('should render with custom type', () => {
      render(<showToast message="Test Warning" type="warning" />);
      expect(screen.queryByText(/warning/i)).not.toBeNull();
    });

    it('should render with custom style', () => {
      render(<showToast message="Test Info" type="info" />);
      expect(screen.queryByText(/info/i)).not.toBeNull();
    });

    it('should render with dismiss button', () => {
      render(<showToast message="Test Dismiss" type="success" dismissButton />);
      const dismissButton = screen.getByText(/dismiss/i);
      fireEvent.click(dismissButton);
      expect(screen.queryByText(/test dismiss/i)).toBeNull();
    });

    it('should render without dismiss button', () => {
      render(<showToast message="Test No Dismiss" type="success" />);
      expect(screen.queryByText(/dismiss/i)).toBeNull();
    });

    it('should render with disableClickDismiss', () => {
      render(<showToast message="Test Click Dismiss" type="success" disableClickDismiss />);
      const toastElement = screen.getByText(/test click dismiss/i);
      fireEvent.click(toastElement);
      expect(screen.queryByText(/test click dismiss/i)).toBeInTheDocument();
    });

    it('should render with preventDuplicate', () => {
      const { rerender } = render(<showToast message="Test Duplicate" type="success" preventDuplicate id="duplicate-id" visibleToasts={[{ id: 'duplicate-id' }]} />);
      rerender(<showToast message="Test Duplicate Again" type="success" preventDuplicate id="duplicate-id" visibleToasts={[{ id: 'duplicate-id' }]} />);
      expect(screen.queryAllByText(/test duplicate again/i).length).toEqual(1);
    });
  });

  describe('Обработка событий', () => {
    it('should call dismiss function on click', () => {
      const mockDismiss = jest.fn();
      render(<showToast message="Test Event" type="success" dismissButton dismissFunction={mockDismiss} />);
      const dismissButton = screen.getByText(/dismiss/i);
      fireEvent.click(dismissButton);
      expect(mockDismiss).toHaveBeenCalledWith('Test Event');
    });
  });

  describe('Вспомогательная функция applyBounce', () => {
    it('should apply bounce effect', () => {
      const element = document.createElement('div');
      element.id = 'test-element';
      document.body.appendChild(element);
      showToast.applyBounce(element);
      expect(element.getAnimations()).toHaveLength(1);
    });
  });
});

// Примечание: поскольку в данном компоненте нет реальных зависимостей или дочерних компонентов, которые необходимо мочить, тесты остаются простыми и изолированными.