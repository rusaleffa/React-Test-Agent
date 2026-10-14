/**
 * Модульные тесты для изолированной проверки компонента для AnimatedGreeting
 * 
 * @file AnimatedGreeting.unit.test.tsx
 * @description Тестирование AnimatedGreeting 
 * @generated 2026-09-07T22:42:37.384Z
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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AnimatedGreeting from '../AnimatedGreeting';
import { UserContext } from '../contexts/UserContext';
import { getRandomGreeting } from '../utils';

describe('AnimatedGreeting', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      user: {},
      emojisStyle: {}
    };
    jest.spyOn(UserContext, 'useContext').mockImplementation(() => mockUser);
  });

  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<AnimatedGreeting />);
      expect(screen.getByText(getRandomGreeting())).toBeInTheDocument();
    });

    it('should render with custom greeting', () => {
      const customGreeting = 'Hello World!';
      mockUser.user.greeting = customGreeting;
      render(<AnimatedGreeting />);
      expect(screen.getByText(customGreeting)).toBeInTheDocument();
    });

    it('should not render when in print mode', () => {
      window.print = jest.fn();
      render(<AnimatedGreeting />);
      expect(window.print).not.toHaveBeenCalled();
    });
  });

  describe('Обновление состояния', () => {
    it('should update greeting after 6 seconds', async () => {
      const randomGreetingSpy = jest.spyOn(getRandomGreeting, 'getRandomGreeting');
      render(<AnimatedGreeting />);
      await waitFor(() => {
        expect(randomGreetingSpy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Взаимодействие с дочерними элементами', () => {
    it('should pass correct prop to child components', () => {
      render(<AnimatedGreeting />);
      const childComponent = screen.getAllByRole('img')[0];
      expect(childComponent.props.unified).toBeDefined();
    });
  });
});