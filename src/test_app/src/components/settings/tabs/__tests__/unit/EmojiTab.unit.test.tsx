/**
 * Модульные тесты для изолированной проверки компонента для EmojiTab
 * 
 * @file EmojiTab.unit.test.tsx
 * @description Тестирование EmojiTab 
 * @generated 2026-09-08T13:22:36.927Z
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
import EmojiTab from '../EmojiTab';
import CustomRadioGroup from '../CustomRadioGroup';
import CustomSwitch from '../CustomSwitch';
import { UserContext } from '../../../contexts/UserContext';
import { OptionItem } from '../settingsTypes';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';

jest.mock('../../../hooks/useOnlineStatus');
jest.mock('@mui/icons-material/WifiOffRounded');
jest.mock('@mui/material/Alert');
jest.mock('@mui/material/Button');
jest.mock('@mui/material/AlertTitle');
jest.mock('../CustomRadioGroup');
jest.mock('../CustomSwitch');

const mockUseOnlineStatus = jest.fn().mockImplementation(() => true);
const mockWifiOffRounded = jest.fn();
const mockAlert = jest.fn();
const mockButton = jest.fn();
const mockAlertTitle = jest.fn();
const mockCustomRadioGroup = jest.fn();
const mockCustomSwitch = jest.fn();

useOnlineStatus.mockImplementation(mockUseOnlineStatus);

const emojiStyles: OptionItem<EmojiStyle>[] = [
  { label: 'Apple', value: EmojiStyle.APPLE },
  { label: 'Facebook', value: EmojiStyle.FACEBOOK },
  { label: 'Discord', value: EmojiStyle.TWITTER },
  { label: 'Google', value: EmojiStyle.GOOGLE },
  { label: 'Native', value: EmojiStyle.NATIVE },
];

describe('EmojiTab', () => {
  let user;

  beforeEach(() => {
    user = {
      darkmode: false,
      emojisStyle: EmojiStyle.APPLE,
      settings: {},
    };
  });

  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <UserContext.Provider value={{ user, setUser: jest.fn() }}>
          <EmojiTab />
        </UserContext.Provider>,
      );

      expect(screen.getByText(/emoji style/i)).toBeInTheDocument();
      expect(CustomRadioGroup).toHaveBeenCalledWith({
        options: emojiStyles,
        value: user.emojisStyle,
        onChange: expect.any(Function),
        disabledOptions: [],
      });

      expect(screen.queryByText(/offline mode/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/clear emoji data/i)).toBeInTheDocument();
    });

    it('should render in offline mode', () => {
      mockUseOnlineStatus.mockImplementationOnce(() => false);

      render(
        <UserContext.Provider value={{ user, setUser: jest.fn() }}>
          <EmojiTab />
        </UserContext.Provider>,
      );

      expect(screen.getByText(/offline mode/i)).toBeInTheDocument();
      expect(screen.queryByText(/clear emoji data/i)).toBeInTheDocument();
    });

    it('should display warning alert in offline mode', () => {
      mockUseOnlineStatus.mockImplementationOnce(() => false);

      render(
        <UserContext.Provider value={{ user, setUser: jest.fn() }}>
          <EmojiTab />
        </UserContext.Provider>,
      );

      expect(mockAlert).toHaveBeenCalledWith({
        severity: 'warning',
        icon: mockWifiOffRounded,
        title: 'Offline Mode',
        children: 'You are currently offline. Non-native emoji styles may not load.',
      });
    });

    it('should clear emoji data button be disabled without hasEmojiData', () => {
      user = {
        ...user,
        settings: {},
      };

      render(
        <UserContext.Provider value={{ user, setUser: jest.fn() }}>
          <EmojiTab />
        </UserContext.Provider>,
      );

      expect(screen.getByText(/clear emoji data/i)).toBeDisabled();
    });

    it('should call setUser and show toast when clearing emoji data', () => {
      const mockSetUser = jest.fn();
      const mockShowToast = jest.fn();

      render(
        <UserContext.Provider value={{ user, setUser: mockSetUser }}>
          <EmojiTab />
        </UserContext.Provider>,
      );

      userEvent.click(screen.getByText(/clear emoji data/i));

      expect(mockSetUser).toHaveBeenCalledWith({ ...user, settings: {} });
      expect(mockShowToast).toHaveBeenCalledWith('Removed emoji data.');
    });
  });

  describe('Обработка изменений в настройках', () => {
    it('should update emojisStyle when radio group changes', () => {
      render(
        <UserContext.Provider value={{ user, setUser: jest.fn() }}>
          <EmojiTab />
        </UserContext.Provider>,
      );

      userEvent.click(screen.getByRole('radio', { name: /apple/i }));

      expect(user.emojisStyle).toEqual(EmojiStyle.APPLE);
    });

    it('should disable native emoji style in offline mode', () => {
      mockUseOnlineStatus.mockImplementationOnce(() => false);

      render(
        <UserContext.Provider value={{ user, setUser: jest.fn() }}>
          <EmojiTab />
        </UserContext.Provider>,
      );

      expect(screen.getByRole('radio', { name: /native/i }).disabled).toBe(true);
    });
  });
});

// Мокаем компоненты для тестирования взаимодействия
CustomRadioGroup.mockImplementation((props) => {
  return <div {...props}>{props.options.map((opt) => opt.label)}</div>;
});

CustomSwitch.mockImplementation((props) => {
  return <div {...props}>Custom Switch</div>;
});