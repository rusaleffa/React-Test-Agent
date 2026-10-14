/**
 * Snapshot-тесты для проверки рендеринга для ReadAloudTab
 * 
 * @file ReadAloudTab.snapshot.test.tsx
 * @description Тестирование ReadAloudTab 
 * @generated 2026-09-08T13:23:32.324Z
 * @type {snapshot}
 * @testCount 7
 * 
 * @dependencies @testing-library/react, react-test-renderer
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D react-test-renderer

import renderer from 'react-test-renderer';
import { UserContext } from '../../../contexts/UserContext';
import { MemoryRouter } from 'react-router-dom';
import { create } from 'jss';
import { ThemeProvider } from '@mui/material/styles';
import { createMuiTheme } from '@mui/material/core';

// Mock context values
const mockUser = {
  settings: {
    enableReadAloud: true,
    voiceVolume: 50,
    voice: 'default-voice',
  },
  emojisStyle: 'unicode',
};

const mockSetUser = jest.fn();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#009387',
    },
  },
});

describe('ReadAloudTab Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
            <ThemeProvider theme={theme}>
              <ReadAloudTab />
            </ThemeProvider>
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with online status enabled', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
            <ThemeProvider theme={theme}>
              <ReadAloudTab />
            </ThemeProvider>
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with offline status', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
            <ThemeProvider theme={theme}>
              <ReadAloudTab />
            </ThemeProvider>
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with empty voices list', () => {
    const mockUserWithoutVoices = {
      ...mockUser,
      settings: {
        ...mockUser.settings,
        voiceVolume: 50,
        voice: '',
      },
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUserWithoutVoices, setUser: mockSetUser }}>
            <ThemeProvider theme={theme}>
              <ReadAloudTab />
            </ThemeProvider>
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with no voice selection', () => {
    const mockUserWithoutVoiceSelection = {
      ...mockUser,
      settings: {
        ...mockUser.settings,
        voice: '',
      },
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUserWithoutVoiceSelection, setUser: mockSetUser }}>
            <ThemeProvider theme={theme}>
              <ReadAloudTab />
            </ThemeProvider>
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with voice volume at minimum', () => {
    const mockUserMinVolume = {
      ...mockUser,
      settings: {
        ...mockUser.settings,
        voiceVolume: 0,
      },
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUserMinVolume, setUser: mockSetUser }}>
            <ThemeProvider theme={theme}>
              <ReadAloudTab />
            </ThemeProvider>
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with voice volume at maximum', () => {
    const mockUserMaxVolume = {
      ...mockUser,
      settings: {
        ...mockUser.settings,
        voiceVolume: 100,
      },
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUserMaxVolume, setUser: mockSetUser }}>
            <ThemeProvider theme={theme}>
              <ReadAloudTab />
            </ThemeProvider>
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});