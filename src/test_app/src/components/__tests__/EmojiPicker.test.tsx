import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CustomEmojiPicker from './CustomEmojiPicker';

describe('CustomEmojiPicker', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<CustomEmojiPicker />);
      expect(screen.getByRole('button')).toBeInTheDocument(); // Проверяем кнопку редактирования
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); // Убедимся, что диалог не отображается сразу
    });

    it('should render with custom emoji', () => {
      render(<CustomEmojiPicker emoji="😊" setEmoji={() => {}} color="#ff0000" name="Task" type="task" />);
      expect(screen.getByText(/😊/)).toBeInTheDocument(); // Проверим рендер выбранного эмодзи
    });

    it('should render simple picker container when settings are configured', () => {
      render(<CustomEmojiPicker settings={{ simpleEmojiPicker: true }} />);
      expect(screen.getByTestId('simple-picker-container')).toBeInTheDocument();
    });

    it('should render dialog when settings are not configured', () => {
      render(<CustomEmojiPicker settings={{ simpleEmojiPicker: false }} />);
      expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should toggle emoji picker on click', () => {
      render(<CustomEmojiPicker />);
      const editButton = screen.getByRole('button');
      userEvent.click(editButton);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should select emoji from picker', async () => {
      render(<CustomEmojiPicker setEmoji={() => {}} />);
      const editButton = screen.getByRole('button');
      userEvent.click(editButton);
      const emojiPicker = screen.getByRole('dialog');
      const emojiOption = screen.getByText(/🤖/); // Пример выбора конкретного эмодзи
      userEvent.click(emojiOption);
      expect(screen.getByText(/🤖/)).toBeInTheDocument();
    });

    it('should remove emoji on remove button click', async () => {
      render(<CustomEmojiPicker setEmoji={() => {}} currentEmoji="😊" />);
      const editButton = screen.getByRole('button');
      userEvent.click(editButton);
      const removeButton = screen.getByText(/Remove Emoji/);
      userEvent.click(removeButton);
      expect(screen.queryByText(/😊/)).not.toBeInTheDocument();
    });

    it('should call AI function when button is clicked', async () => {
      jest.spyOn(CustomEmojiPicker.prototype, 'useAI').mockImplementation(async () => {});
      render(<CustomEmojiPicker name="test" type="task" />);
      const aiButton = screen.getByText(/Find emoji with AI/);
      userEvent.click(aiButton);
      await waitFor(() => expect(CustomEmojiPicker.prototype.useAI).toHaveBeenCalledWith());
    });
  });
});

describe('Helper Functions', () => {
  it('should convert emoji to unified format', () => {
    const result = CustomEmojiPicker.emojiToUnified(':)');
    expect(result).toEqual('263a');
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: CustomEmojiPicker.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для CustomEmojiPicker
// ============================================
import renderer from 'react-test-renderer';
import { CustomEmojiPicker } from './CustomEmojiPicker';

describe('CustomEmojiPicker Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<CustomEmojiPicker />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Emoji Prop', () => {
    test('should match snapshot with provided emoji', () => {
      const tree = renderer.create(<CustomEmojiPicker emoji="😊" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Color Prop', () => {
    test('should match snapshot with provided color', () => {
      const tree = renderer.create(<CustomEmojiPicker color="#ff0000" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Type Task', () => {
    test('should match snapshot with type task', () => {
      const tree = renderer.create(<CustomEmojiPicker type="task" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Type Category', () => {
    test('should match snapshot with type category', () => {
      const tree = renderer.create(<CustomEmojiPicker type="category" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Show Emoji Picker', () => {
    test('should match snapshot with show emoji picker', () => {
      const tree = renderer.create(<CustomEmojiPicker showEmojiPicker={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Current Emoji', () => {
    test('should match snapshot with current emoji', () => {
      const tree = renderer.create(<CustomEmojiPicker currentEmoji="🚀" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Loading State', () => {
    test('should match snapshot with loading state', () => {
      const tree = renderer.create(<CustomEmojiPicker isLoading={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Error State', () => {
    test('should match snapshot with error state', () => {
      const tree = renderer.create(<CustomEmojiPicker hasError={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With No Emoji Selected', () => {
    test('should match snapshot with no emoji selected', () => {
      const tree = renderer.create(<CustomEmojiPicker currentEmoji={null} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With AI Feature Enabled', () => {
    test('should match snapshot with ai feature enabled', () => {
      const tree = renderer.create(<CustomEmojiPicker useAI={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With AI Feature Disabled', () => {
    test('should match snapshot with ai feature disabled', () => {
      const tree = renderer.create(<CustomEmojiPicker useAI={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Online Status Offline', () => {
    test('should match snapshot with online status offline', () => {
      const tree = renderer.create(<CustomEmojiPicker isOnline={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Online Status Online', () => {
    test('should match snapshot with online status online', () => {
      const tree = renderer.create(<CustomEmojiPicker isOnline={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Simple Emoji Picker On', () => {
    test('should match snapshot with simple emoji picker on', () => {
      const tree = renderer.create(<CustomEmojiPicker settings={{ simpleEmojiPicker: true }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Simple Emoji Picker Off', () => {
    test('should match snapshot with simple emoji picker off', () => {
      const tree = renderer.create(<CustomEmojiPicker settings={{ simpleEmojiPicker: false }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: CustomEmojiPicker.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для CustomEmojiPicker
// ============================================
Ниже представлен пример кода интеграционного теста для компонента `CustomEmojiPicker`. В этом примере используется библиотека MSW для мокирования сетевых запросов и библиотеки `@testing-library/react`, а также дополнительные инструменты такие как `userEvent`.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../store'; // Предположим, что у вас есть Redux store
import { UserContext } from '../contexts/UserContext';
import { MemoryRouter } from 'react-router-dom';
import CustomEmojiPicker from './CustomEmojiPicker';

// Моки для сетевого запроса к API
const server = setupServer(
  rest.post('/api/some-endpoint', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      data: {
        // Данные, которые вы ожидаете получить от API
      }
    }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Пример контекста пользователя
const mockUser = {
  user: {
    emojisStyle: 'NATIVE',
    settings: {
      simpleEmojiPicker: false
    }
  },
  setUser: jest.fn()
};

describe('CustomEmojiPicker Integration Tests', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <UserContext.Provider value={mockUser}>
            <CustomEmojiPicker />
          </UserContext.Provider>
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Choose the perfect emoji/i)).toBeInTheDocument(); // Проверка наличия текста на странице
  });

  it('tests interaction with the picker', async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <UserContext.Provider value={mockUser}>
            <CustomEmojiPicker />
          </UserContext.Provider>
        </Provider>
      </MemoryRouter>
    );

    // Имитация клика на кнопку открытия пипера
    userEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Ожидание появления диалогового окна
    await waitFor(() => screen.getByRole('dialog'));

    // Проверка содержимого диалога
    expect(screen.getByText(/Choose the perfect emoji/i)).toBeInTheDocument();

    // Имитация выбора эмодзи из списка
    userEvent.click(screen.getByRole('button', { name: /🤖/i }));

    // Ожидание изменения отображаемого эмодзи в аватаре
    await waitFor(() => screen.queryByText(/🤖/i));

    // Проверка того, что текущий эмодзи обновился
    expect(mockUser.setUser).toHaveBeenCalledWith({
      ...mockUser.user,
      emojisStyle: 'NATIVE'
    });
  });

  it('tests loading behavior', async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <UserContext.Provider value={mockUser}>
            <CustomEmojiPicker />
          </UserContext.Provider>
        </Provider>
      </MemoryRouter>
    );

    // Имитация клика на кнопку открытия пипера
    userEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Ожидание появления диалогового окна
    await waitFor(() => screen.getByRole('dialog'));

    // Имитация отсутствия сети
    server.use(
      rest.get('*', (req, res, ctx) => res(ctx.delay(10000)))
    );

    // Имитация попытки выбрать эмодзи при отсутствии сети
    userEvent.click(screen.getByRole('button', { name: /🤖/i }));

    // Ожидание сообщения об ошибке
    await waitFor(() => screen.getByText(/Emojis may not load correctly/i));
  });
});
Этот пример демонстрирует базовую структуру интеграционного тестирования компонента `CustomEmojiPicker`. Он включает настройку окружения, использование моков для сетевых запросов, проверку пользовательского интерфейса и поведения компонента при различных сценариях использования.
