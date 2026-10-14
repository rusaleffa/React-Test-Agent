/**
 * Модульные тесты для изолированной проверки компонента для GeneralTab
 * 
 * @file GeneralTab.unit.test.tsx
 * @description Тестирование GeneralTab 
 * @generated 2026-09-08T13:22:50.651Z
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
import GeneralTab from '../GeneralTab';
import CustomSwitch from '../CustomSwitch'; // импортируем дочерний компонент


describe('GeneralTab', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<GeneralTab />);

      expect(screen.getByText(/enable categories/i)).toBeInTheDocument();
      expect(screen.getByText(/enable categories/i).closest('label')).toHaveAttribute('for', 'enableCategories');
      expect(screen.getByText(/enable categories/i).nextElementSibling).toMatchInlineSnapshot(`<CustomSwitch>`);  

      expect(screen.getByText(/app badge/i)).toBeInTheDocument();
      expect(screen.getByText(/app badge/i).closest('label')).toHaveAttribute('for', 'appBadge');
      expect(screen.getByText(/app badge/i).nextElementSibling).toMatchInlineSnapshot(`<CustomSwitch>`);

      expect(screen.getByText(/completed tasks at bottom/i)).toBeInTheDocument();
      expect(screen.getByText(/completed tasks at bottom/i).closest('label')).toHaveAttribute('for', 'doneToBottom');
      expect(screen.getByText(/completed tasks at bottom/i).nextElementSibling).toMatchInlineSnapshot(`<CustomSwitch>`);

      expect(screen.getByText(/show progress bar/i)).toBeInTheDocument();
      expect(screen.getByText(/show progress bar/i).closest('label')).toHaveAttribute('for', 'showProgressBar');
      expect(screen.getByText(/show progress bar/i).nextElementSibling).toMatchInlineSnapshot(`<CustomSwitch>`);
    });

    it('should render with disabled prop for App Badge', () => {
      const isPWA = false;
      const setAppBadge = undefined; // имитируем отсутствие поддержки браузера
      render(
        <GeneralTab
          systemInfo={{ isPWA }}
          navigator={{ setAppBadge }}
        />
      );

      expect(screen.queryByText(/app badge/i)).not.toBeInTheDocument(); // элемент не должен рендериться
    });
  });

  describe('Взаимодействие с элементами', () => {
    let mockSetAppBadge;

    beforeEach(() => {
      mockSetAppBadge = jest.fn();
      render(
        <GeneralTab
          systemInfo={{ isPWA: true }}
          navigator={{ setAppBadge: mockSetAppBadge }}
        />
      );
    });

    it('should toggle enableCategories switch', async () => {
      await userEvent.click(screen.getByLabelText(/enable categories/i));

      expect(mockSetAppBadge).not.toHaveBeenCalled(); // нет необходимости в вызове внешнего API
    });

    it('should toggle showProgressBar switch', async () => {
      await userEvent.click(screen.getByLabelText(/show progress bar/i));

      expect(mockSetAppBadge).not.toHaveBeenCalled(); // нет необходимости в вызове внешнего API
    });

    it('should toggle appBadge switch', async () => {
      await userEvent.click(screen.getByLabelText(/app badge/i));

      expect(mockSetAppBadge).toHaveBeenCalled(); // внешний API должен быть вызван при изменении состояния
    });

    it('should toggle doneToBottom switch', async () => {
      await userEvent.click(screen.getByLabelText(/completed tasks at bottom/i));

      expect(mockSetAppBadge).not.toHaveBeenCalled(); // нет необходимости в вызове внешнего API
    });
  });
});