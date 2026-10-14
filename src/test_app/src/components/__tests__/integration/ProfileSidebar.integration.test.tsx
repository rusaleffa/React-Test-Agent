/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для ProfileSidebar
 * 
 * @file ProfileSidebar.integration.test.tsx
 * @description Тестирование ProfileSidebar 
 * @generated 2026-09-07T22:47:30.749Z
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
import { createMemoryHistory } from 'history';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserContextProvider } from '../contexts/UserContext';
import { store } from '../store';
import ProfileSidebar from './ProfileSidebar';

const mockUser = {
  name: 'John Doe',
  profilePicture: '/path/to/profile/picture.jpg',
  tasks: [],
  settings: {},
};

const history = createMemoryHistory();

const server = setupServer(
  // Mocking API calls here
  rest.get('/api/users/me', (req, res, ctx) =>
    res(ctx.json(mockUser)),
  ),
  rest.get('/api/repo-data', (req, res, ctx) =>
    res(ctx.json({
      stargazers_count: 100,
      open_issues_count: 5,
    })),
  ),
  rest.get('/api/bmc-supporters', (req, res, ctx) =>
    res(ctx.json({
      supportersCount: 20,
    })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProfileSidebar Integration Tests', () => {
  it('should display user information correctly', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter initialEntries={[history.location.pathname]}>
          <Routes>
            <Route path="/" element={<ProfileSidebar />} />
          </Routes>
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByRole('button')).toHaveTextContent(/John Doe/); // Check user's name
    expect(screen.getByRole('img', { name: 'User' })).toHaveAttribute('src', '/path/to/profile/picture.jpg'); // Check profile picture
    expect(screen.queryByText('Tasks')).toBeInTheDocument(); // Check menu item presence
    expect(screen.queryByText('Add Task')).toBeInTheDocument();
    expect(screen.queryByText('Categories')).toBeInTheDocument();
    expect(screen.queryByText('Purge Tasks')).toBeInTheDocument();
    expect(screen.queryByText('Transfer')).toBeInTheDocument();
    expect(screen.queryByText('Sync Devices')).toBeInTheDocument();
    expect(screen.queryByText('Github')).toBeInTheDocument();
    expect(screen.queryByText('Report Issue')).toBeInTheDocument();
    expect(screen.queryByText('Buy me a coffee')).toBeInTheDocument();
    expect(screen.queryByText('Install App')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Settings')).toBeInTheDocument();
    expect(screen.queryByText('User')).toBeInTheDocument();
  });

  it('should display correct counts and icons', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter initialEntries={[history.location.pathname]}>
          <Routes>
            <Route path="/" element={<ProfileSidebar />} />
          </Routes>
        </BrowserRouter>
      </Provider>,
    );

    // Test stars count
    expect(screen.getByText('100 stars on Github').closest('.MuiMenuItem-root')).toBeInTheDocument();

    // Test issue count
    expect(screen.getByText('5 open issues').closest('.MuiMenuItem-root')).toBeInTheDocument();

    // Test BMC supporters count
    expect(screen.getByText('20 supporters on Buy me a coffee').closest('.MuiMenuItem-root')).toBeInTheDocument();
  });

  it('should navigate to different routes', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter initialEntries={[history.location.pathname]}>
          <Routes>
            <Route path="/" element={<ProfileSidebar />} />
          </Routes>
        </BrowserRouter>
      </Provider>,
    );

    userEvent.click(screen.getByText('Tasks'));
    await waitFor(() => expect(history.location.pathname).toEqual('/'));

    userEvent.click(screen.getByText('Add Task'));
    await waitFor(() => expect(history.location.pathname).toEqual('/add'));

    userEvent.click(screen.getByText('Categories'));
    await waitFor(() => expect(history.location.pathname).toEqual('/categories'));

    userEvent.click(screen.getByText('Purge Tasks'));
    await waitFor(() => expect(history.location.pathname).toEqual('/purge'));

    userEvent.click(screen.getByText('Transfer'));
    await waitFor(() => expect(history.location.pathname).toEqual('/transfer'));

    userEvent.click(screen.getByText('Sync Devices'));
    await waitFor(() => expect(history.location.pathname).toEqual('/sync'));

    userEvent.click(screen.getByText('Report Issue'));
    await waitFor(() => expect(history.location.pathname).toEqual('https://github.com/maciekt07/TodoApp/issues/new'));

    userEvent.click(screen.getByText('Buy me a coffee'));
    await waitFor(() => expect(history.location.pathname).toEqual('https://www.buymeacoffee.com/maciekt07'));

    userEvent.click(screen.getByText('Install App'));
    await waitFor(() => expect(history.location.pathname).toEqual('/'));

    userEvent.click(screen.getByText('Logout'));
    await waitFor(() => expect(history.location.pathname).toEqual('/'));
  });

  it('should display correct toast messages', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter initialEntries={[history.location.pathname]}>
          <Routes>
            <Route path="/" element={<ProfileSidebar />} />
          </Routes>
        </BrowserRouter>
      </Provider>,
    );

    // Simulate a successful installation of the PWA
    const installPWASpy = jest.fn();
    const showToastSpy = jest.spyOn(window, 'showToast');
    const deferredPrompt = {
      prompt: jest.fn().mockReturnValue(Promise.resolve({ outcome: 'accepted' })),
      userChoice: jest.fn(),
    };
    global.deferredPrompt = deferredPrompt;

    userEvent.click(screen.getByText('Install App'));
    await waitFor(installPWASpy);

    expect(showToastSpy).toHaveBeenCalledWith('App installed successfully!', { type: 'success' });
  });

  it('should display correct settings options', async () => {
    render(
      <UserContextProvider value={{ user: mockUser, setUser: () => {} }}>
        <Provider store={store}>
          <BrowserRouter initialEntries={[history.location.pathname]}>
            <Routes>
              <Route path="/" element={<ProfileSidebar />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </UserContextProvider>,
    );

    userEvent.click(screen.getByText('Settings'));
    await waitFor(() => expect(screen.getByText('Settings')).toBeVisible());
  });
});