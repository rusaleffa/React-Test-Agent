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

// ============================================
// SNAPSHOT TESTS
// Файл: handleToggle.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для handleToggle
// ============================================
import renderer from 'react-test-renderer';
import { UserContext } from '../../contexts/UserContext';  
import { createMemoryRouter } from 'react-router-dom';
import { renderHook } from '@testing-library/react-hooks';

// Mock UserContext for testing purposes
const mockUser = {
  settings: {
    someSetting: true
  },
  setUser: jest.fn()
};

jest.mock('../../contexts/UserContext', () => ({
  useContext: () => mockUser
}));

describe('handleToggle Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when enabled and no text or reason', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle header="Test Header" settingKey="someSetting" />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when enabled with text but no reason', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle header="Test Header" text="Some Text" settingKey="someSetting" />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when enabled with both text and reason', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle header="Test Header" text="Some Text" settingKey="someSetting" disabledReason="Disabled Reason" />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when disabled without reason', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle header="Test Header" settingKey="someSetting" disabled />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when disabled with reason', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle header="Test Header" settingKey="someSetting" disabled disabledReason="Disabled Reason" />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: handleToggle.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для handleToggle
// ============================================
Ниже представлен пример кода интеграционного теста для компонента `handleToggle` в формате TypeScript с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContextProvider } from '../../contexts/UserContext'; // Предположим, что это ваш провайдер контекста
import { reducer } from '../../reducers'; // Предположим, что у вас есть редуктор
import { CustomSwitch } from './CustomSwitch'; // Импортируйте компонент для тестирования

// Создаем сервер MSW для мокирования сетевых запросов
const server = setupServer(
  // Моки сетевых запросов здесь...
  rest.get('/api/settings', (req, res, ctx) =>
    res(ctx.json({
      settings: {
        notificationEnabled: true,
      },
    })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Создаем хранилище Redux и передаем его в провайдер
const store = createStore(reducer);

describe('handleToggle Integration Tests', () => {
  it('should toggle the switch state when clicked', async () => {
    render(
      <Provider store={store}>
        <UserContextProvider>
          <CustomSwitch
            header="Test Header"
            settingKey="notificationEnabled"
          />
        </UserContextProvider>
      </Provider>,
    );

    // Ждем полной отрисовки компонента
    await waitFor(() => expect(screen.queryByRole('switch')).toBeInTheDocument());

    // Кликаем на переключатель
    userEvent.click(screen.getByRole('switch'));

    // Ожидаем изменения состояния переключателя
    await waitFor(() => expect(screen.queryByRole('switch', { checked: false })).toBeInTheDocument());
  });

  it('should show a disabled reason when switch is disabled', async () => {
    render(
      <Provider store={store}>
        <UserContextProvider>
          <CustomSwitch
            header="Test Header"
            settingKey="notificationEnabled"
            disabled
            disabledReason="This feature is currently unavailable."
          />
        </UserContextProvider>
      </Provider>,
    );

    // Ждем полной отрисовки компонента
    await waitFor(() => expect(screen.queryByText(/This feature is currently unavailable./i)).toBeInTheDocument());
  });
});
### Примечания к реализации:
- **MSW**: Используется для мокирования сетевых запросов и имитации поведения API.
- **Redux**: Предполагается наличие редуктора и провайдера Redux (`Provider`), который передается в компонент через HOC или контекст.
- **Пользовательские действия**: Для эмуляции действий пользователя используется библиотека `@testing-library/user-event`.
- **Проверки состояний**: Используются методы из библиотеки `@testing-library/react`, такие как `waitFor`, `screen.queryByRole`, чтобы убедиться, что состояние переключателя изменилось корректно после клика.

Этот шаблон можно адаптировать под конкретные требования вашего проекта, добавляя дополнительные проверки и сценарии использования.
