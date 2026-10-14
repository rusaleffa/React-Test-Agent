/**
 * Модульные тесты для изолированной проверки компонента для handleToggle
 * 
 * @file handleToggle.unit.test.tsx
 * @description Тестирование handleToggle 
 * @generated 2026-09-08T13:20:17.044Z
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
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserContext } from '../../contexts/UserContext';
import CustomSwitch from '../CustomSwitch';

describe('CustomSwitch', () => {
  let mockUser;
  let mockSetUser;

  beforeEach(() => {
    mockUser = {
      settings: {
        testSetting: false,
      },
    };
    mockSetUser = jest.fn();
  });

  describe('Рендеринг', () => {
    it('should render without errors', () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <CustomSwitch
            header="Test Header"
            settingKey="testSetting"
          />
        </UserContext.Provider>
      );
      expect(screen.queryByRole('switch')).toBeInTheDocument();
    });

    it('should render with custom header and prop values', () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <CustomSwitch
            header="Custom Header"
            text="Custom Text"
            settingKey="testSetting"
          />
        </UserContext.Provider>
      );
      expect(screen.getByText(/custom header/i)).toBeInTheDocument();
      expect(screen.getByText(/custom text/i)).toBeInTheDocument();
    });

    it('should render disabled switch when passed disabled prop', () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <CustomSwitch
            header="Disabled Test"
            settingKey="testSetting"
            disabled
          />
        </UserContext.Provider>
      );
      expect(screen.getByRole('switch').disabled).toEqual(true);
    });

    it('should render disabled reason when passed disabledReason prop', () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <CustomSwitch
            header="Disabled Reason Test"
            settingKey="testSetting"
            disabled
            disabledReason="Reason for disabling"
          />
        </UserContext.Provider>
      );
      expect(screen.getByText(/reason for disabling/i)).toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    it('should toggle the switch state on click', () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <CustomSwitch
            header="Test Toggle"
            settingKey="testSetting"
          />
        </UserContext.Provider>
      );
      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);
      expect(mockSetUser).toHaveBeenCalledWith({
        settings: {
          testSetting: true,
        },
      });
    });

    it('should not change state when switch is disabled', () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <CustomSwitch
            header="Disabled Toggle"
            settingKey="testSetting"
            disabled
          />
        </UserContext.Provider>
      );
      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);
      expect(mockSetUser).not.toHaveBeenCalled();
    });

    it('should trigger onChange event on enter press', () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <CustomSwitch
            header="Enter Press Test"
            settingKey="testSetting"
          />
        </UserContext.Provider>
      );
      const switchElement = screen.getByRole('switch');
      userEvent.tabTo(switchElement);
      userEvent.type(switchElement, '{enter}');
      expect(mockSetUser).toHaveBeenCalled();
    });
  });
});