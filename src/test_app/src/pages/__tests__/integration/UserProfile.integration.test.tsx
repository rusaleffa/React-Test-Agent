/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для UserProfile
 * 
 * @file UserProfile.integration.test.tsx
 * @description Тестирование UserProfile 
 * @generated 2026-09-08T13:36:16.656Z
 * @type {integration}
 * @testCount 6
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