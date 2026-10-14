/**
 * Модульные тесты для изолированной проверки компонента для ReadAloudTab
 * 
 * @file ReadAloudTab.unit.test.tsx
 * @description Тестирование ReadAloudTab 
 * @generated 2026-09-08T13:23:32.322Z
 * @type {unit}
 * @testCount 10
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
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ReadAloudTab from './ReadAloudTab';
import { UserContext } from '../../../contexts/UserContext';
import { SpeechSynthesisVoice } from 'speech-synthesis';
import { BrowserRouter } from 'react-router-dom';

const mockUser = {
  settings: {
    enableReadAloud: true,
    voiceVolume: 0.5,
    voice: 'English',
  },
};

const mockAvailableVoices: SpeechSynthesisVoice[] = [
  {
    name: 'English',
    localService: true,
    default: true,
    lang: 'en-US',
  },
  {
    name: 'French',
    localService: false,
    lang: 'fr-FR',
  },
];

const MockUserProvider = ({ children }) => (
  <UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
    {children}
  </UserContext.Provider>
);

describe('ReadAloudTab', () => {
  describe('Рендеринг', () => {
    it('renders correctly with default props', () => {
      render(
        <BrowserRouter>
          <MockUserProvider>
            <ReadAloudTab />
          </MockUserProvider>
        </BrowserRouter>,
      );

      expect(screen.getByText('Enable Read Aloud')).toBeInTheDocument();
      expect(screen.getByText('Play Sample')).toBeInTheDocument();
      expect(screen.getByText('Voice Selection')).toBeInTheDocument();
      expect(screen.getByText('Voice Volume')).toBeInTheDocument();
    });

    it('renders without speech synthesis support', () => {
      render(
        <BrowserRouter>
          <MockUserProvider>
            <ReadAloudTab />
          </MockUserProvider>
        </BrowserRouter>,
        { container: document.createElement('div') },
      );

      expect(screen.queryByText('Speech Synthesis Not Supported')).toBeInTheDocument();
    });

    it('renders with no voices available', () => {
      const emptyVoices: SpeechSynthesisVoice[] = [];
      render(
        <BrowserRouter>
          <MockUserProvider>
            <ReadAloudTab availableVoices={emptyVoices} />
          </MockUserProvider>
        </BrowserRouter>,
      );

      expect(screen.getByText('There are no voice styles available')).toBeInTheDocument();
    });

    it('renders with online status warning', () => {
      const mockUserWithoutInternet = {
        ...mockUser,
        settings: {
          ...mockUser.settings,
          enableReadAloud: true,
        },
      };
      render(
        <BrowserRouter>
          <MockUserProvider>
            <ReadAloudTab availableVoices={mockAvailableVoices} isOnline={false} />
          </MockUserProvider>
        </BrowserRouter>,
      );

      expect(screen.getByText('Offline Mode')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    let component;

    beforeEach(() => {
      component = render(
        <BrowserRouter>
          <MockUserProvider>
            <ReadAloudTab availableVoices={mockAvailableVoices} />
          </MockUserProvider>
        </BrowserRouter>,
      );
    });

    it('plays sample text', async () => {
      fireEvent.click(screen.getByText('Play Sample'));
      await waitFor(() => expect(screen.getByText('Stop Circle Rounded')).toBeInTheDocument());
      fireEvent.click(screen.getByText('Stop Circle Rounded'));
      await waitFor(() => expect(screen.getByText('Record Voice Over Rounded')).toBeInTheDocument());
    });

    it('selects voice', () => {
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'French' } });
      expect(mockUser.setUser).toHaveBeenCalledWith({
        ...mockUser,
        settings: {
          ...mockUser.settings,
          voice: 'French',
        },
      });
    });

    it('handles voice volume slider change', () => {
      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '0.7' } });
      expect(mockUser.setUser).toHaveBeenCalledWith({
        ...mockUser,
        settings: {
          ...mockUser.settings,
          voiceVolume: 0.7,
        },
      });
    });

    it('handles mute/unmute', () => {
      const muteBtn = screen.getByRole('button', { name: /mute/i });
      fireEvent.click(muteBtn);
      expect(mockUser.setUser).toHaveBeenCalledWith({
        ...mockUser,
        settings: {
          ...mockUser.settings,
          voiceVolume: 0,
        },
      });
    });
  });
});

describe('Helper Functions', () => {
  it('getLanguageRegion returns correct values', () => {
    expect(ReadAloudTab.getLanguageRegion('en-US')).toEqual('United States');
    expect(ReadAloudTab.getLanguageRegion('pl-PL')).toEqual('Poland');
  });

  it('getFlagUnicodes returns flag unicodes', () => {
    expect(ReadAloudTab.getFlagUnicodes('US')).toEqual('1F1FA-1F1F8');
    expect(ReadAloudTab.getFlagUnicodes('PL')).toEqual('1F1E7-1F1EA');
  });
});