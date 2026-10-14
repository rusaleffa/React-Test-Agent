import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';
import { UserContext } from '../../contexts/UserContext';
import { createMemoryContext } from '../../__mocks__/createMemoryContext';

const mockUser = {
  name: 'John Doe',
  profilePicture: 'http://example.com/profile.jpg',
  tasks: [],
  settings: {},
};

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
    {children}
  </UserContext.Provider>
);

describe('ProfileSidebar', () => {
  let user;

  beforeEach(() => {
    user = mockUser;
  });

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      const { container } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('displays user name and avatar', () => {
      const { getByText, getByRole } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(getByRole('button')).toHaveTextContent(/John Doe/);
      expect(getByRole('img')).toHaveAttribute('src', 'http://example.com/profile.jpg');
    });

    it('handles clicks on menu items', () => {
      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      fireEvent.click(getByText(/Tasks/));
      expect(getByText(/Tasks/)).toBeInTheDocument(); // ensure it's still visible after clicking

      fireEvent.click(getByText(/Add Task/));
      expect(getByText(/Add Task/)).toBeInTheDocument();

      fireEvent.click(getByText(/Categories/));
      expect(getByText(/Categories/)).toBeInTheDocument();

      fireEvent.click(getByText(/Purge Tasks/));
      expect(getByText(/Purge Tasks/)).toBeInTheDocument();

      fireEvent.click(getByText(/Transfer/));
      expect(getByText(/Transfer/)).toBeInTheDocument();

      fireEvent.click(getByText(/Sync Devices/));
      expect(getByText(/Sync Devices/)).toBeInTheDocument();

      fireEvent.click(getByText(/Report Issue/));
      expect(getByText(/Report Issue/)).toBeInTheDocument();

      fireEvent.click(getByText(/Buy me a coffee/));
      expect(getByText(/Buy me a coffee/)).toBeInTheDocument();

      fireEvent.click(getByText(/Install App/));
      expect(getByText(/Install App/)).toBeInTheDocument();

      fireEvent.click(getByText(/Logout/));
      expect(getByText(/Logout/)).toBeInTheDocument();
    });

    it('shows toast message when installing app', () => {
      const mockShowToast = jest.fn();
      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      fireEvent.click(getByText(/Install App/));
      waitFor(() => expect(mockShowToast).toHaveBeenCalledWith('App installed successfully!'));
    });

    it('displays correct number of stars and issues', () => {
      const mockRepoData = {
        stargazers_count: 100,
        open_issues_count: 5,
      };

      const mockFetchGitHubInfo = jest.fn().mockResolvedValue({
        repoData: mockRepoData,
        branchData: {},
      });

      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(getByText(/100 stars on Github/)).toBeInTheDocument();
      expect(getByText(/5 open issues/)).toBeInTheDocument();
    });

    it('displays last update information', () => {
      const mockLastUpdate = '2023-01-01T12:00:00Z';
      const mockUser = {
        ...mockUser,
        lastSyncedAt: mockLastUpdate,
      };

      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(getByText(/Last synced Jan 1, 2023 at 12:00 PM/)).toBeInTheDocument();
    });

    it('displays credits information', () => {
      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(getByText(/Made with ❤️ by maciekt07/)).toBeInTheDocument();
    });
  });

  describe('Interaction with child components', () => {
    it('passes correct props to child components', () => {
      const { getByRole } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      const link = getByRole('link');
      expect(link.href).toEqual('/');
    });
  });

  describe('API calls', () => {
    it('makes correct API calls', async () => {
      const mockFetchGitHubInfo = jest.fn().mockResolvedValue({
        repoData: {
          stargazers_count: 100,
          open_issues_count: 5,
        },
        branchData: {},
      });

      const mockFetchBMCInfo = jest.fn().mockResolvedValue({
        supportersCount: 10,
      });

      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      await waitFor(() => expect(mockFetchGitHubInfo).toHaveBeenCalled());
      await waitFor(() => expect(mockFetchBMCInfo).toHaveBeenCalled());

      expect(getByText(/100 stars on Github/)).toBeInTheDocument();
      expect(getByText(/10 supporters on Buy me a coffee/)).toBeInTheDocument();
    });
  });
});

// Additional tests can be added here based on specific requirements or edge cases.

// ============================================
// SNAPSHOT TESTS
// Файл: ProfileSidebar.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для ProfileSidebar
// ============================================
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@emotion/react';
import { UserContext } from '../contexts/UserContext';
import { createMemoryRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { Theme } from '../theme/themeConfig';
import { ProfileSidebar } from '.';

describe('ProfileSidebar Snapshot Tests', () => {
  let userProps;

  // Настройка контекста и маршрутов перед каждым тестом
  beforeEach(() => {
    userProps = {
      user: {
        name: 'John Doe',
        profilePicture: 'example.jpg',
        tasks: [],
        settings: {},
      },
      setUser: jest.fn(),
    };
  });

  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={userProps}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match loading state snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, loading: true } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    test('should match error state snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, error: 'An error occurred' } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Empty Data', () => {
    test('should match empty data snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, tasks: [] } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Full Data', () => {
    test('should match full data snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, tasks: ['Task 1', 'Task 2'] } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Dark Mode', () => {
    test('should match dark mode snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, darkmode: true } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Different Name', () => {
    test('should match different name snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, name: 'Jane Smith' } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Different Avatar', () => {
    test('should match different avatar snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, profilePicture: 'different.jpg' } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Different Settings', () => {
    test('should match different settings snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, settings: { enableCategories: true } } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: ProfileSidebar.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для ProfileSidebar
// ============================================
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
