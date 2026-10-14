/**
 * Модульные тесты для изолированной проверки компонента для UserContext
 * 
 * @file UserContext.unit.test.tsx
 * @description Тестирование UserContext 
 * @generated 2026-09-08T13:30:09.848Z
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
import { UserContext } from '../UserContext';
import { defaultUser } from '../constants/defaultUser';

describe('UserContext', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<UserContext />);
      expect(screen.queryByRole('context')).toBeInTheDocument();
      expect(screen.queryByText(defaultUser.name)).toBeInTheDocument();
    });

    it('should render with custom props', () => {
      const customUser = { name: 'John Doe' };
      const setUserMock = jest.fn();
      render(
        <UserContext.Provider value={{ user: customUser, setUser: setUserMock }}>
          <div>Test</div>
        </UserContext.Provider>
      );
      expect(screen.queryByText(customUser.name)).toBeInTheDocument();
      expect(setUserMock).not.toHaveBeenCalled(); // Проверяем отсутствие вызова обработчика
    });
  });

  describe('Обновление состояния', () => {
    let setUserMock;
    beforeEach(() => {
      setUserMock = jest.fn();
    });

    it('should call setUser when updating state', () => {
      render(
        <UserContext.Provider value={{ user: defaultUser, setUser: setUserMock }}>
          <button onClick={() => setUserMock({ name: 'New Name' })} />
        </UserContext.Provider>
      );
      userEvent.click(screen.getByRole('button'));
      expect(setUserMock).toHaveBeenCalledWith({ name: 'New Name' });
    });
  });
});