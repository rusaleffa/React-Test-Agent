import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LogoutDialog from '../LogoutDialog';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { CustomDialogTitle } from './DialogTitle';
import { DialogBtn } from '../styles';
import { Logout } from '@mui/icons-material';
import { UserContext } from '../contexts/UserContext';
import { defaultUser } from '../constants/defaultUser';
import { deleteProfilePictureFromDB, showToast } from '../utils';

const mockSetUser = jest.fn();
jest.mock('../contexts/UserContext', () => ({
  useContext: () => ({ setUser }),
}));

const mockDeleteProfilePictureFromDB = jest.fn();
jest.mock('../utils', () => ({
  deleteProfilePictureFromDB: mockDeleteProfilePictureFromDB,
  showToast: jest.fn(),
}));

describe('LogoutDialog', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<LogoutDialog open={true} onClose={() => {}} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /logout confirmation/i }));
      expect(screen.getByText(/are you sure you want to logout/i));
      expect(screen.getAllByRole('button').length).toEqual(2);
      expect(mockSetUser).not.toHaveBeenCalled();
    });

    it('should render with custom props', () => {
      render(
        <LogoutDialog
          open={false}
          onClose={() => {}}
          title="Test Title"
          message="Test Message"
        />
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    let onCloseMock;
    beforeEach(() => {
      onCloseMock = jest.fn();
    });

    it('should close dialog when cancel button is clicked', () => {
      render(<LogoutDialog open={true} onClose={onCloseMock} />);
      userEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should log out and close dialog when confirm button is clicked', async () => {
      render(<LogoutDialog open={true} onClose={onCloseMock} />);
      userEvent.click(screen.getByRole('button', { name: /logout/i }));
      await Promise.resolve(); // simulate async operations
      expect(mockSetUser).toHaveBeenCalledWith(defaultUser);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(mockDeleteProfilePictureFromDB).toHaveBeenCalled();
      expect(showToast).toHaveBeenCalledWith('You have been successfully logged out');
    });
  });

  describe('Взаимодействие с дочерними компонентами', () => {
    it('should pass correct props to child components', () => {
      render(<LogoutDialog open={true} onClose={() => {}} />);
      const dialogTitle = screen.getByRole('heading', { name: /logout confirmation/i });
      expect(dialogTitle.props.icon.type).toEqual(Logout);
      const dialogContent = screen.getByText(/are you sure you want to logout/i);
      expect(dialogContent.parentElement.closest(DialogContent)).toBeDefined();
      const dialogButtons = screen.getAllByRole('button');
      expect(dialogButtons.length).toEqual(2);
      expect(dialogButtons[0].textContent.trim()).toEqual('Cancel');
      expect(dialogButtons[1].textContent.trim()).toContain('Logout');
    });
  });
});

// Дополнительные моки или настройки можно добавить здесь, если потребуется

// ============================================
// SNAPSHOT TESTS
// Файл: LogoutDialog.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для LogoutDialog
// ============================================
import renderer from 'react-test-renderer';
import { LogoutDialog } from './LogoutDialog';

describe('LogoutDialog Snapshot Tests', () => {
  // Базовый случай с открытыми пропсами
  test('should match snapshot with default props', () => {
    const tree = renderer.create(<LogoutDialog open={true} onClose={() => {}} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай закрытого диалога
  test('should match snapshot when closed', () => {
    const tree = renderer.create(<LogoutDialog open={false} onClose={() => {}} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай без иконки и заголовка
  test('should match snapshot without title and icon', () => {
    const tree = renderer.create(
      <LogoutDialog open={true} onClose={() => {}}>
        <DialogContent>
          Content without title or icon
        </DialogContent>
      </LogoutDialog>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай с кастомным заголовком и иконкой
  test('should match snapshot with custom title and icon', () => {
    const tree = renderer.create(
      <LogoutDialog open={true} onClose={() => {}}>
        <CustomDialogTitle title="Custom Title" onClose={() => {}} icon={<Logout />}
      </CustomDialogTitle>
      <DialogContent>
        Content with custom title and icon
      </DialogContent>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай с ошибочным состоянием
  test('should match snapshot in error state', () => {
    const tree = renderer.create(
      <LogoutDialog open={true} onClose={() => {}}>
        <DialogContent>
          Error message here
        </DialogContent>
      </LogoutDialog>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай с загрузочным состоянием
  test('should match snapshot in loading state', () => {
    const tree = renderer.create(
      <LogoutDialog open={true} onClose={() => {}}>
        <DialogContent>
          Loading...
        </DialogContent>
      </LogoutDialog>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: LogoutDialog.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для LogoutDialog
// ============================================
Вот пример кода интеграционного теста для компонента `LogoutDialog`:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogoutDialog from './LogoutDialog'; // импортируйте компонент здесь
import { UserContext } from '../contexts/UserContext';
import { defaultUser } from '../constants/defaultUser';

// Моки для серверной части
const server = setupServer(
  rest.delete('/delete-profile-picture-from-db', (req, res, ctx) =>
    res(ctx.status(200)),
  ),
  rest.post('/show-toast', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ message: 'You have been successfully logged out' })),
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LogoutDialog Integration Tests', () => {
  let mockSetUser;

  beforeEach(() => {
    mockSetUser = jest.fn();
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <LogoutDialog open onClose={() => {}} />
      </UserContext.Provider>,
    );
  });

  it('should trigger the correct actions when clicking cancel button', async () => {
    const cancelButton = screen.getByText(/cancel/i);
    userEvent.click(cancelButton);

    expect(mockSetUser).not.toHaveBeenCalled(); // проверяем, что состояние пользователя не изменилось
  });

  it('should trigger the correct actions when clicking logout button', async () => {
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    userEvent.click(logoutButton);

    await waitFor(() => expect(mockSetUser).toHaveBeenCalledWith(defaultUser));
    await waitFor(() => expect(screen.queryByText(/you have been successfully logged out/i)).not.toBeNull());
  });
});
### Пояснение к коду:

1. **Настройка MSW**:  
   Мы используем библиотеку MSW для создания мок-сервера, который имитирует поведение реальных запросов к API.
   
2. **Настройка провайдера контекста**:  
   Компонент `LogoutDialog` использует контекст `UserContext`, поэтому мы создаем его провайдер в тесте.

3. **Тестирование кнопок**:  
   - Первая проверка подтверждает, что при нажатии кнопки «Отмена» ничего не происходит — состояние пользователя остается неизменным.
   - Вторая проверка удостоверяется, что при нажатии кнопки «Выйти» вызывается метод `setUser` из контекста и отображается сообщение о успешном выходе.

4. **Асинхронная проверка**:  
   Для проверки сообщения об успешной аутентификации используется функция `waitFor`.

Этот подход позволяет убедиться, что весь жизненный цикл компонента корректно обрабатывает пользовательские действия и обновляет состояние приложения.
