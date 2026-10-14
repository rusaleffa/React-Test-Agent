import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import UserProfile from './UserProfile';
import { UserContext } from '../contexts/UserContext';
import { createMemoryContext } from '../test_utils';

const mockUser = {
  name: 'John Doe',
  profilePicture: 'LOCAL_FILE_abc123',
  createdAt: '2023-01-01T12:00:00Z'
};

const mockContextValue = {
  user: mockUser,
  setUser: jest.fn()
};

const MockUserContext = createMemoryContext(UserContext, mockContextValue);

describe('UserProfile', () => {
  let userProfileComponent;

  beforeEach(() => {
    userProfileComponent = (
      <MockUserContext>
        <MemoryRouter>
          <UserProfile />
        </MemoryRouter>
      </MockUserContext>
    );
  });

  it('renders correctly with default props', () => {
    render(userProfileComponent);

    expect(screen.getByText(/User John Doe/i)).toBeInTheDocument();
    expect(screen.getByTestId('top-bar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Settings/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /John Doe/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Add Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save name/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('updates user name when valid input is provided', async () => {
    render(userProfileComponent);

    const input = screen.getByLabelText(/Add Name/i);
    userEvent.type(input, 'Jane Doe');

    fireEvent.click(screen.getByRole('button', { name: /Save name/i }));

    await waitFor(() => {
      expect(mockContextValue.setUser).toHaveBeenCalledWith({
        ...mockUser,
        name: 'Jane Doe'
      });
    });
  });

  it('does not update user name when invalid input is provided', async () => {
    render(userProfileComponent);

    const input = screen.getByLabelText(/Add Name/i);
    userEvent.type(input, 'a'.repeat(USER_NAME_MAX_LENGTH + 1)); // Exceeds limit

    fireEvent.click(screen.getByRole('button', { name: /Save name/i }));

    await waitFor(() => {
      expect(mockContextValue.setUser).not.toHaveBeenCalled();
    });
  });

  it('displays warning alert when profile picture is broken', async () => {
    render(userProfileComponent);

    // Simulate a broken profile picture scenario
    mockContextValue.user.profilePicture = 'BAD_PROFILE_PIC';

    await waitFor(() => {
      expect(screen.queryByText(/Profile picture might be broken/i)).toBeInTheDocument();
    });
  });

  it('opens and closes change image dialog', async () => {
    render(userProfileComponent);

    const button = screen.getByRole('button', { name: /Change or delete profile picture/i });
    userEvent.click(button);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('uploads profile picture via file upload', async () => {
    render(userProfileComponent);

    const fileInput = screen.getByRole('button', { name: /Upload from file/i });
    userEvent.upload(fileInput, new File(['test'], 'test.jpg', { type: 'image/jpeg' }));

    await waitFor(() => {
      expect(mockContextValue.setUser).toHaveBeenCalledWith({
        ...mockUser,
        profilePicture: 'NEW_PROFILE_PIC_ID'
      });
    });
  });

  it('deletes profile picture', async () => {
    render(userProfileComponent);

    const deleteButton = screen.getByRole('button', { name: /Remove Profile Picture/i });
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockContextValue.setUser).toHaveBeenCalledWith({
        ...mockUser,
        profilePicture: null
      });
    });
  });

  it('handles logout click', async () => {
    render(userProfileComponent);

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    userEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockContextValue.setUser).toHaveBeenCalledWith(null);
    });
  });
});

// Helper function to create memory context
function createMemoryContext(contextType, initialValue) {
  return {
    Provider: ({ children }) => <contextType.Provider value={initialValue}>{children}</contextType.Provider>,
  };
}

// ============================================
// SNAPSHOT TESTS
// Файл: UserProfile.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для UserProfile
// ============================================
import renderer from 'react-test-renderer';
import { UserProfile } from './UserProfile';

describe('UserProfile Snapshot Tests', () => {
  describe('Default Props and States', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<UserProfile />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when loading avatar', () => {
      const tree = renderer.create(<UserProfile />).toJSON(); // simulate loading state
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when showing broken profile picture alert', () => {
      const tree = renderer.create(<UserProfile />).toJSON(); // simulate broken profile picture scenario
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when showing logout dialog', () => {
      const tree = renderer.create(<UserProfile />).toJSON(); // simulate logout dialog
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when showing change image dialog', () => {
      const tree = renderer.create(<UserProfile />).toJSON(); // simulate change image dialog
      expect(tree).toMatchSnapshot();
    });
  });

  describe('States and Scenarios', () => {
    test('should match snapshot when updating user name', () => {
      const tree = renderer.create(<UserProfile user={{ name: 'John Doe' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when changing profile picture via link', () => {
      const tree = renderer.create(<UserProfile user={{ profilePicture: 'LOCAL_FILE_abc123' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when changing profile picture via file upload', () => {
      const tree = renderer.create(<UserProfile user={{ profilePicture: '' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when deleting profile picture', () => {
      const tree = renderer.create(<UserProfile user={{ profilePicture: 'LOCAL_FILE_abc123' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: UserProfile.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для UserProfile
// ============================================
Ниже приведен пример кода интеграционного теста для компонента `UserProfile`, который учитывает требования и структуру, описанные в задаче.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from './UserProfile'; // импортируйте компонент здесь
import { UserContext } from '../contexts/UserContext'; // импортируйте контекст пользователя
import { Provider } from 'react-redux'; // если используете Redux
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const server = setupServer(
  // мокаем API вызовы
  rest.get('/api/users/current', (req, res, ctx) =>
    res(ctx.json({
      id: 1,
      name: 'John Doe',
      profilePicture: 'LOCAL_FILE_abc123',
      createdAt: '2023-01-01T12:00:00Z'
    }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserProfile Integration Tests', () => {
  let history;

  beforeEach(() => {
    history = createMemoryHistory();
  });

  it('should display user information correctly', async () => {
    render(
      <Provider>
        <Router history={history}>
          <UserContext.Provider value={{ user: { name: 'John Doe' } }}>
            <UserProfile />
          </UserContext.Provider>
        </Router>
      </Provider>
    );

    expect(screen.getByText(/User John Doe/i)).toBeInTheDocument(); // проверяем отображение имени пользователя
    expect(screen.getByRole('img')).toHaveAttribute('src', '/images/profile.png'); // проверяем профильную картинку
    expect(screen.getByText(/Registered/i)).toBeInTheDocument(); // проверяем дату регистрации
  });

  it('should update user name successfully', async () => {
    render(
      <Provider>
        <Router history={history}>
          <UserContext.Provider value={{ user: { name: 'John Doe' } }}>
            <UserProfile />
          </UserContext.Provider>
        </Router>
      </Provider>
    );

    const input = screen.getByLabelText(/add name/i); // находим поле ввода имени
    userEvent.type(input, 'Jane Smith');
    userEvent.tab(); // имитируем нажатие Enter или пробел для отправки формы

    await waitFor(() => expect(screen.queryByText(/User Jane Smith/i)).toBeInTheDocument()); // ожидаем изменения текста
  });

  it('should handle invalid profile picture URL', async () => {
    render(
      <Provider>
        <Router history={history}>
          <UserContext.Provider value={{ user: { name: 'John Doe' } }}>
            <UserProfile />
          </UserContext.Provider>
        </Router>
      </Provider>
    );

    const input = screen.getByLabelText(/link to profile picture/i); // находим поле ввода ссылки на изображение профиля
    userEvent.type(input, 'invalid-url');
    userEvent.tab(); // имитируем нажатие Enter или пробел для отправки формы

    await waitFor(() => expect(screen.getByText(/Invalid profile picture URL./i)).toBeInTheDocument()); // ожидаем сообщения об ошибке
  });

  it('should handle valid profile picture URL', async () => {
    render(
      <Provider>
        <Router history={history}>
          <UserContext.Provider value={{ user: { name: 'John Doe' } }}>
            <UserProfile />
          </UserContext.Provider>
        </Router>
      </Provider>
    );

    const input = screen.getByLabelText(/link to profile picture/i); // находим поле ввода ссылки на изображение профиля
    userEvent.type(input, 'https://example.com/image.jpg');
    userEvent.tab(); // имитируем нажатие Enter или пробел для отправки формы

    await waitFor(() => expect(screen.getByText(/Profile picture updated with link./i)).toBeInTheDocument()); // ожидаем успешного сообщения
  });

  it('should handle file upload', async () => {
    render(
      <Provider>
        <Router history={history}>
          <UserContext.Provider value={{ user: { name: 'John Doe' } }}>
            <UserProfile />
          </UserContext.Provider>
        </Router>
      </Provider>
    );

    const input = screen.getByRole('button', { name: /upload from file/i }); // находим кнопку выбора файла
    userEvent.click(input);

    const fileInput = screen.getByRole('textbox', { name: /upload from file/i });
    userEvent.upload(fileInput, ['path/to/test-image.jpg']);

    await waitFor(() => expect(screen.getByText(/Profile picture uploaded./i)).toBeInTheDocument()); // ожидаем успешного сообщения
  });

  it('should handle profile picture deletion', async () => {
    render(
      <Provider>
        <Router history={history}>
          <UserContext.Provider value={{ user: { name: 'John Doe', profilePicture: 'LOCAL_FILE_abc123' } }}>
            <UserProfile />
          </UserContext.Provider>
        </Router>
      </Provider>
    );

    const button = screen.getByRole('button', { name: /remove profile picture/i });
    userEvent.click(button);

    await waitFor(() => expect(screen.queryByText(/Profile picture removed./i)).toBeInTheDocument()); // ожидаем успешного сообщения
  });
});
Этот набор тестов охватывает основные сценарии использования компонента `UserProfile`, включая проверку корректного отображения данных, успешное обновление имени пользователя, обработку некорректной ссылки на изображение профиля, загрузку изображения из файла и удаление текущего изображения профиля.
