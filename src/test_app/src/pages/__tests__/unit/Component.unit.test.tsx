/**
 * Модульные тесты для изолированной проверки компонента для Component
 * 
 * @file Component.unit.test.tsx
 * @description Тестирование Component 
 * @generated 2026-09-08T13:32:47.859Z
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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import NotFound from './NotFound';

describe('NotFound component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<NotFound />);

      expect(screen.getByText(/Page /i)).toBeInTheDocument();
      expect(screen.getByText(/was not found./i)).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent(/Go back to tasks/i);
    });

    it('should render custom message prop', () => {
      const customMessage = 'Custom error message';
      render(<NotFound message={customMessage} />);

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('should truncate long pathnames', () => {
      const longPathname = '/very-long-path/to/a/page/that/is/well/beyond/32/characters';
      render(<NotFound message={<div>{longPathname}</div>} />);

      expect(
        screen.getByRole('heading').textContent
      ).toMatchInlineSnapshot(`"404"`);
      expect(screen.getByText(longPathname.substring(0, 29) + "...")).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should navigate to "/" when clicking the button', async () => {
      render(<NotFound />);

      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => expect(window.location.pathname).toEqual('/'));
    });
  });
});