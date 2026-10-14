/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для ReadAloudTab
 * 
 * @file ReadAloudTab.integration.test.tsx
 * @description Тестирование ReadAloudTab 
 * @generated 2026-09-08T13:23:32.324Z
 * @type {integration}
 * @testCount 5
 * 
 * @dependencies @testing-library/react, @testing-library/jest-dom, msw
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D @testing-library/jest-dom
// npm install -D msw

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