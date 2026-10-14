import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SettingsDialog from './SettingsDialog';
import { UserContext } from '../../contexts/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/core';

const mockUser = {
  user: {
    darkmode: false,
    theme: 'light',
  },
};

const mockSettingsTabs = [
  {
    label: 'Appearance',
    icon: <PaletteRounded />,
    Component: () => <div data-testid="appearance-tab">Appearance</div>,
  },
  {
    label: 'General',
    heading: 'General Settings',
    icon: <SettingsRounded />,
    Component: () => <div data-testid="general-tab">General</div>,
  },
  {
    label: 'Emoji',
    heading: 'Emoji Settings',
    icon: <EmojiEmotionsRounded />,
    Component: () => <div data-testid="emoji-tab">Emoji</div>,
  },
  {
    label: 'Read Aloud',
    heading: 'Read Aloud Settings',
    icon: <RecordVoiceOverRounded />,
    Component: () => <div data-testid="read-aloud-tab">Read Aloud</div>,
  },
  {
    label: 'Shortcuts',
    heading: 'Keyboard Shortcuts',
    icon: <KeyboardCommandKeyRounded />,
    Component: () => <div data-testid="shortcuts-tab">Shortcuts</div>,
  },
  {
    label: 'About',
    heading: 'About This App',
    icon: <InfoRounded />,
    Component: () => <div data-testid="about-tab">About</div>,
  },
];

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockHistoryReplaceState = jest.fn();
jest.mock('history', () => ({
  replaceState: mockHistoryReplaceState,
}));

const mockShowToast = jest.fn();
jest.mock('../../utils/showToast', () => mockShowToast);

const mockCreateTabSlug = jest.fn().mockImplementation(label => label.replace(/\s+/g, ''));

const mockHandleDialogClose = jest.fn();

const mockScrollRef = { current: null };

const mockUseResponsiveDisplay = jest.fn().mockReturnValue(false);

const mockMuiTheme = createTheme({
  palette: {
    mode: 'light',
    secondary: {
      main: '#ff0000',
    },
  },
});

const mockUserContext = {
  user: mockUser.user,
};

const mockLazyComponent = jest.fn(() => <div>Lazy Component</div>);

const mockSettingsTabsWithLazyComponents = mockSettingsTabs.map(tab => ({
  ...tab,
  Component: mockLazyComponent,
}));

describe('SettingsDialog', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(
        <Router>
          <ThemeProvider theme={mockMuiTheme}>
            <UserContext.Provider value={mockUserContext}>
              <SettingsDialog open onClose={mockHandleDialogClose} handleOpen={() => {}} />
            </UserContext.Provider>
          </ThemeProvider>
        </Router>,
      );

      expect(screen.getByText(/Settings/i)).toBeInTheDocument();
      expect(screen.getByText(/Manage Your settings and preferences/i)).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toHaveStyle({'max-width': 'md'});
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockHistoryReplaceState).not.toHaveBeenCalled();
      expect(mockShowToast).not.toHaveBeenCalled();
    });

    it('should render with custom props', () => {
      render(
        <Router>
          <ThemeProvider theme={mockMuiTheme}>
            <UserContext.Provider value={mockUserContext}>
              <SettingsDialog open onClose={mockHandleDialogClose} handleOpen={() => {}} />
            </UserContext.Provider>
          </ThemeProvider>
        </Router>,
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Appearance' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'General' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Emoji' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Read Aloud' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Shortcuts' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'About' })).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    let component;

    beforeEach(() => {
      component = render(
        <Router>
          <ThemeProvider theme={mockMuiTheme}>
            <UserContext.Provider value={mockUserContext}>
              <SettingsDialog open onClose={mockHandleDialogClose} handleOpen={() => {}} />
            </UserContext.Provider>
          </ThemeProvider>
        </Router>,
      );
    });

    it('should close dialog when clicking close button', async () => {
      userEvent.click(screen.getByRole('button', { name: /close/i }));
      await waitFor(() => expect(mockHandleDialogClose).toHaveBeenCalled());
    });

    it('should navigate to tab when selecting tab', async () => {
      userEvent.click(screen.getByRole('tab', { name: 'General' }));
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/#settings/general'));
    });

    it('should update tab value when navigating via URL hash', async () => {
      window.location.hash = '#settings/appearance';
      userEvent.click(screen.getByRole('tab', { name: 'Appearance' }));
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/#settings/appearance'));
    });

    it('should show toast when invalid tab is selected', async () => {
      window.location.hash = '#settings/invalid';
      userEvent.click(screen.getByRole('tab', { name: 'Invalid' }));
      await waitFor(() => expect(mockShowToast).toHaveBeenCalledWith('Invalid settings tab: "Invalid". Redirecting to default tab.', { type: 'warning' }));
    });
  });

  describe('Lazy Components', () => {
    it('should load lazy components correctly', () => {
      render(
        <Router>
          <ThemeProvider theme={mockMuiTheme}>
            <UserContext.Provider value={mockUserContext}>
              <SettingsDialog open onClose={mockHandleDialogClose} handleOpen={() => {}} />
            </UserContext.Provider>
          </ThemeProvider>
        </Router>,
      );

      expect(mockLazyComponent).toHaveBeenCalledTimes(6);
    });
  });

  describe('Scroll Behavior', () => {
    it('should scroll to top of the page when switching tabs', () => {
      render(
        <Router>
          <ThemeProvider theme={mockMuiTheme}>
            <UserContext.Provider value={mockUserContext}>
              <SettingsDialog open onClose={mockHandleDialogClose} handleOpen={() => {}} />
            </UserContext.Provider>
          </ThemeProvider>
        </Router>,
      );

      userEvent.click(screen.getByRole('tab', { name: 'General' }));
      expect(mockScrollRef.current.scrollTo).toHaveBeenCalledWith({ top: 0 });
    });
  });

  describe('Dark Mode', () => {
    it('should change theme color based on dark mode setting', () => {
      render(
        <Router>
          <ThemeProvider theme={mockMuiTheme}>
            <UserContext.Provider value={{ user: { darkmode: true, theme: 'light' } }}>
              <SettingsDialog open onClose={mockHandleDialogClose} handleOpen={() => {}} />
            </UserContext.Provider>
          </ThemeProvider>
        </Router>,
      );

      expect(document.querySelector('meta[name=theme-color]').getAttribute('content')).toEqual('#383838');
    });
  });
});

describe('SettingsTabs', () => {
  it('should render settings tabs correctly', () => {
    render(
      <Router>
        <ThemeProvider theme={mockMuiTheme}>
          <UserContext.Provider value={mockUserContext}>
            <SettingsDialog open onClose={mockHandleDialogClose} handleOpen={() => {}} />
          </UserContext.Provider>
        </ThemeProvider>
      </Router>,
    );

    expect(screen.getByTestId('appearance-tab')).toBeInTheDocument();
    expect(screen.getByTestId('general-tab')).toBeInTheDocument();
    expect(screen.getByTestId('emoji-tab')).toBeInTheDocument();
    expect(screen.getByTestId('read-aloud-tab')).toBeInTheDocument();
    expect(screen.getByTestId('shortcuts-tab')).toBeInTheDocument();
    expect(screen.getByTestId('about-tab')).toBeInTheDocument();
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: SettingsDialog.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для SettingsDialog
// ============================================
import renderer from 'react-test-renderer';
import { SettingsDialog } from './SettingsDialog';

describe('SettingsDialog Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<SettingsDialog />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Open State', () => {
    test('should match snapshot when open prop is true', () => {
      const tree = renderer.create(<SettingsDialog open />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when open prop is false', () => {
      const tree = renderer.create(<SettingsDialog open={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match snapshot during loading state', () => {
      const tree = renderer.create(
        <SettingsDialog open loading={true}>
          <CircularProgress size={48} />
        </SettingsDialog>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    test('should match snapshot when error occurs', () => {
      const tree = renderer.create(
        <SettingsDialog open error={new Error('Test Error')} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Different Themes', () => {
    test('should match snapshot in light mode', () => {
      const tree = renderer.create(
        <SettingsDialog open>
          <SettingsDialog />
        </SettingsDialog>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot in dark mode', () => {
      const tree = renderer.create(
        <SettingsDialog open>
          <SettingsDialog />
        </SettingsDialog>, {
          createNodeMock: () => ({
            ...document.createElement('html'),
            classList: {
              add: () => {},
              contains: () => true,
            },
          })
        }
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: SettingsDialog.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для SettingsDialog
// ============================================
Ниже приведён пример кода интеграционного тестирования компонента `SettingsDialog` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для проверки пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsDialog } from './SettingsDialog'; // импортируйте компонент здесь
import { UserContext } from '../../contexts/UserContext'; // импортируйте контекст пользователя
import { Provider as UserProvider } from '../../contexts/UserContext'; // импортируйте провайдер контекста пользователя

const server = setupServer(
  // Мокируем данные для каждого из табов
  rest.get('/api/appearance', (req, res, ctx) => res(ctx.json({ appearanceData: {} }))),
  rest.get('/api/general', (req, res, ctx) => res(ctx.json({ generalData: {} }))),
  rest.get('/api/emoji', (req, res, ctx) => res(ctx.json({ emojiData: {} }))),
  rest.get('/api/read-aloud', (req, res, ctx) => res(ctx.json({ readAloudData: {} }))),
  rest.get('/api/shortcuts', (req, res, ctx) => res(ctx.json({ shortcutsData: {} }))),
  rest.get('/api/about', (req, res, ctx) => res(ctx.json({ aboutData: {} })))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('SettingsDialog Integration Tests', () => {
  it('should load and display settings tabs correctly', async () => {
    render(
      <UserProvider>
        <SettingsDialog open={true} onClose={() => {}} />
      </UserProvider>
    );

    // Ожидаем завершения загрузки данных
    await waitFor(() => expect(screen.queryByText(/appearance/i)).toBeInTheDocument());

    // Проверяем наличие всех вкладок
    ['Appearance', 'General', 'Emoji', 'Read Aloud', 'Shortcuts', 'About'].forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    // Проверяем заголовки вкладок
    ['Appearance', 'General Settings', 'Emoji Settings', 'Read Aloud Settings', 'Keyboard Shortcuts', 'About This App'].forEach(heading => {
      expect(screen.getByText(heading)).toBeInTheDocument();
    });

    // Проверка иконок вкладок
    ['PaletteRounded', 'SettingsRounded', 'EmojiEmotionsRounded', 'RecordVoiceOverRounded', 'KeyboardCommandKeyRounded', 'InfoRounded'].forEach(icon => {
      expect(screen.getByRole('button').findByTestId(icon)).toBeInTheDocument();
    });

    // Проверка содержимого каждой вкладки
    ['Appearance', 'General', 'Emoji', 'Read Aloud', 'Shortcuts', 'About'].forEach(tabLabel => {
      const tab = screen.getByText(tabLabel);
      userEvent.click(tab);

      // Проверяем содержимое текущей вкладки
      switch (tabLabel) {
        case 'Appearance':
          expect(screen.getByText('appearanceData')).toBeInTheDocument();
          break;
        case 'General':
          expect(screen.getByText('generalData')).toBeInTheDocument();
          break;
        case 'Emoji':
          expect(screen.getByText('emojiData')).toBeInTheDocument();
          break;
        case 'Read Aloud':
          expect(screen.getByText('readAloudData')).toBeInTheDocument();
          break;
        case 'Shortcuts':
          expect(screen.getByText('shortcutsData')).toBeInTheDocument();
          break;
        case 'About':
          expect(screen.getByText('aboutData')).toBeInTheDocument();
          break;
      }
    });
  });
});
Этот пример демонстрирует базовый подход к интеграции и проверке функциональности компонента `SettingsDialog`. В реальных сценариях вам может понадобиться расширить тесты дополнительными проверками состояний, обработкой ошибок и взаимодействием с пользователем через методы `userEvent`.

Обратите внимание на использование `waitFor` для ожидания завершения асинхронной загрузки данных перед выполнением дальнейших проверок.
