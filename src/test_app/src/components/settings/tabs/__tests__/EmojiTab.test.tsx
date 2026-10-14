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

// ============================================
// SNAPSHOT TESTS
// Файл: EmojiTab.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для EmojiTab
// ============================================
import renderer from 'react-test-renderer';
import { UserContext } from '../../../contexts/UserContext';
import { createMemoryRouter } from 'react-router-dom';
import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { EmojiTab } from './index';

// Mock store and context
const mockStore = configureStore([thunk]);
const initialState = {
  user: {
    darkmode: true,
    emojisStyle: 'NATIVE',
    settings: {},
  },
};

const mockUserContext = {
  user: initialState.user,
  setUser: jest.fn(),
};

describe('EmojiTab Snapshot Tests', () => {
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('should match snapshot with default props', () => {
    const component = (
      <Provider store={store}>
        <UserContext.Provider value={mockUserContext}>
          <createMemoryRouter>
            <EmojiTab />
          </createMemoryRouter>
        </UserContext.Provider>
      </Provider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with online status', () => {
    const updatedUser = {
      ...initialState.user,
      darkmode: false,
      emojisStyle: 'FACEBOOK',
    };
    const updatedMockUserContext = {
      user: updatedUser,
      setUser: jest.fn(),
    };

    act(() => {
      renderHook(() => useOnlineStatus(), { initialProps: {} });
    });

    const component = (
      <Provider store={store}>
        <UserContext.Provider value={updatedMockUserContext}>
          <createMemoryRouter>
            <EmojiTab />
          </createMemoryRouter>
        </UserContext.Provider>
      </Provider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with offline status', () => {
    const updatedUser = {
      ...initialState.user,
      darkmode: false,
      emojisStyle: 'FACEBOOK',
    };
    const updatedMockUserContext = {
      user: updatedUser,
      setUser: jest.fn(),
    };

    act(() => {
      renderHook(() => useOnlineStatus(), { initialProps: {} });
    });

    const component = (
      <Provider store={store}>
        <UserContext.Provider value={updatedMockUserContext}>
          <createMemoryRouter>
            <EmojiTab />
          </createMemoryRouter>
        </UserContext.Provider>
      </Provider>
    );

    // Simulate offline status
    global.navigator.onLine = false;

    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with no emoji data', () => {
    const updatedUser = {
      ...initialState.user,
      darkmode: false,
      emojisStyle: 'FACEBOOK',
    };
    const updatedMockUserContext = {
      user: updatedUser,
      setUser: jest.fn(),
    };

    act(() => {
      renderHook(() => useOnlineStatus(), { initialProps: {} });
    });

    const component = (
      <Provider store={store}>
        <UserContext.Provider value={updatedMockUserContext}>
          <createMemoryRouter>
            <EmojiTab />
          </createMemoryRouter>
        </UserContext.Provider>
      </Provider>
    );

    // Remove emoji data
    localStorage.removeItem('epr_suggested');

    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: EmojiTab.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для EmojiTab
// ============================================
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider as UserContextProvider } from '../../../contexts/UserContext';
import EmojiTab from './EmojiTab';

// Моки для MSW
const server = setupServer(
  // Мокаем получение данных из API или локального хранилища
  rest.get('/api/emojis', (req, res, ctx) =>
    res(ctx.json({
      emojis: ['😊', '🤖', '👑'],
    })),
  ),
  // Мокаем проверку онлайн статуса
  rest.get('/api/isOnline', (req, res, ctx) =>
    res(ctx.json({ online: true })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('EmojiTab Integration', () => {
  it('should display emoji style options and handle selection', async () => {
    render(
      <UserContextProvider>
        <EmojiTab />
      </UserContextProvider>,
    );

    expect(screen.queryByText(/emoji style/i)).toBeInTheDocument(); // Проверяем заголовок

    // Проверка отображения опций
    const radioButtons = screen.queryAllByRole('radio');
    expect(radioButtons).toHaveLength(5); // У нас 5 опций

    // Проверим выбор опции Apple
    await userEvent.click(radioButtons[0]); // Кликаем на первую опцию
    expect(screen.queryByDisplayValue('Apple')).toBeInTheDocument(); // Проверяем выбранную опцию

    // Проверим обновление пользовательских настроек
    const userContext = window.__TEST_USER_CONTEXT__ || {};
    expect(userContext.user.emojisStyle).toEqual('APPLE'); // Проверяем обновленные настройки
  });

  it('should display warning alert in offline mode', async () => {
    server.use(
      rest.get('/api/isOnline', (req, res, ctx) =>
        res(ctx.json({ online: false })), // Отключаем интернет
      ),
    );

    render(
      <UserContextProvider>
        <EmojiTab />
      </UserContextProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/offline mode/i)).toBeInTheDocument(); // Проверяем текст предупреждения
    });
  });

  it('should clear emoji data successfully', async () => {
    render(
      <UserContextProvider>
        <EmojiTab />
      </UserContextProvider>,
    );

    // Нажимаем кнопку очистки данных
    await userEvent.click(screen.queryByText(/clear emoji data/i));

    // Ожидаем появления сообщения о удалении данных
    await waitFor(() => {
      expect(screen.queryByText(/removed emoji data/i)).toBeInTheDocument();
    });

    // Проверяем, что данные были успешно очищены
    expect(localStorage.getItem('epr_suggested')).toBeNull();
  });
});
