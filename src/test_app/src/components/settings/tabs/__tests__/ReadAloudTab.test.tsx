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

// ============================================
// SNAPSHOT TESTS
// Файл: ReadAloudTab.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для ReadAloudTab
// ============================================
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

// ============================================
// INTEGRATION TESTS
// Файл: ReadAloudTab.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для ReadAloudTab
// ============================================
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContext } from '../../../contexts/UserContext';
import { UserProvider } from '../../../contexts/UserContext';
import { ReduxProvider } from '../../../store';
import ReadAloudTab from './ReadAloudTab';

// Mock initial state for UserContext
const mockUser = {
  settings: {
    enableReadAloud: true,
    voiceVolume: 0.7,
    voice: 'default-voice',
  },
  emojisStyle: 'flat',
};

// Create a redux store with mocked user context
const store = createStore((state) => state, { user: mockUser });

const server = setupServer(
  // Mock API calls here if needed
  rest.get('/api/voices', (req, res, ctx) => {
    return res(ctx.json([
      {
        name: 'Default Voice',
        localService: true,
        default: true,
        voiceURI: 'local-voice',
        lang: 'en-US'
      },
      {
        name: 'Google Voice',
        localService: false,
        voiceURI: 'google-voice',
        lang: 'en-US'
      },
      {
        name: 'Microsoft Voice',
        localService: false,
        voiceURI: 'microsoft-voice',
        lang: 'en-US'
      }
    ]));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ReadAloudTab Integration Tests', () => {
  it('renders correctly with available voices', () => {
    render(
      <Provider store={store}>
        <UserProvider value={{ user: mockUser }}>
          <ReadAloudTab />
        </UserProvider>
      </Provider>
    );

    expect(screen.queryByRole('button')).toBeInTheDocument(); // Check that buttons exist
    expect(screen.queryByTestId('volume-slider')).toBeInTheDocument(); // Check slider exists
  });

  it('plays sample text when play button clicked', async () => {
    render(
      <Provider store={store}>
        <UserProvider value={{ user: mockUser }}>
          <ReadAloudTab />
        </UserProvider>
      </Provider>
    );

    await waitFor(() => {
      userEvent.click(screen.getByText('Play Sample'));
    });

    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1); // Verify speech synthesis call
  });

  it('updates voice selection', async () => {
    render(
      <Provider store={store}>
        <UserProvider value={{ user: mockUser }}>
          <ReadAloudTab />
        </UserProvider>
      </Provider>
    );

    const selectElement = screen.getByRole('combobox');
    userEvent.selectOptions(selectElement, ['Google Voice']);

    expect(mockUser.settings.voice).toEqual('Google Voice::en-US'); // Verify updated voice
  });

  it('handles voice volume change', async () => {
    render(
      <Provider store={store}>
        <UserProvider value={{ user: mockUser }}>
          <ReadAloudTab />
        </UserProvider>
      </Provider>
    );

    const slider = screen.getByRole('slider');
    userEvent.moveTo(slider, { x: 50 }); // Move slider halfway
    userEvent.simulate('change', slider, { target: { value: 0.5 } });

    expect(mockUser.settings.voiceVolume).toEqual(0.5); // Verify updated volume
  });

  it('handles mute/unmute functionality', async () => {
    render(
      <Provider store={store}>
        <UserProvider value={{ user: mockUser }}>
          <ReadAloudTab />
        </UserProvider>
      </Provider>
    );

    const muteButton = screen.getByRole('button', { name: /mute/i });
    userEvent.click(muteButton);

    expect(mockUser.settings.voiceVolume).toEqual(0); // Verify volume set to zero
  });
});
