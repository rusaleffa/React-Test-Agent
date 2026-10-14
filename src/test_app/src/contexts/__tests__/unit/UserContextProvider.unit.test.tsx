/**
 * Модульные тесты для изолированной проверки компонента для UserContextProvider
 * 
 * @file UserContextProvider.unit.test.tsx
 * @description Тестирование UserContextProvider 
 * @generated 2026-09-08T13:30:17.251Z
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
import { UserContextProvider } from '../UserContextProvider';
import { UserContext } from '../contexts/UserContext';

describe('UserContextProvider', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<UserContextProvider />);
      expect(screen.queryByRole('user')).toBeNull();
    });

    it('should pass correct context to child components', () => {
      const ChildComponent = () => (
        <UserContext.Consumer>
          {(value) => <div data-testid="child-component" {...value} />}
        </UserContext.Consumer>
      );

      render(
        <UserContextProvider>
          <ChildComponent />
        </UserContextProvider>
      );

      const childElement = screen.getByTestId('child-component');
      expect(childElement).toHaveAttribute('data-user', JSON.stringify({ user: defaultUser }));
    });
  });
});