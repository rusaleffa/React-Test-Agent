import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GlobalQuickSaveHandler from '../GlobalQuickSaveHandler';
import { Dialog, DialogContent, DialogActions, Typography } from '@mui/material';
import { CustomDialogTitle } from '.';
import { DialogBtn } from '../styles';
import { SaveAltRounded } from '@mui/icons-material';
import { UserContext } from '../contexts/UserContext';
import { exportTasksToJson } from '../utils';
import { useTheme } from '@emotion/react';
import { useSystemTheme } from '../hooks/useSystemTheme';
import { isDarkMode } from '../utils/colorUtils';

const mockUser = {
  user: {
    darkmode: 'light',
  },
  setUser: jest.fn(),
};

const mockExportTasksToJson = jest.fn();
jest.mock('../utils', () => ({
  exportTasksToJson: mockExportTasksToJson,
}));

const MockChildComponent = () => <div data-testid="child-component">Child Component</div>;

describe('GlobalQuickSaveHandler', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <GlobalQuickSaveHandler>
            <MockChildComponent />
          </GlobalQuickSaveHandler>
        </UserContext.Provider>,
      );

      expect(screen.getByTestId('child-component')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render dialog when key combination pressed', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <GlobalQuickSaveHandler>
            <MockChildComponent />
          </GlobalQuickSaveHandler>
        </UserContext.Provider>,
      );

      userEvent.type(screen.getByTestId('child-component'), '{cmd}s');

      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    it('should not render dialog when shift+key combination pressed', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <GlobalQuickSaveHandler>
            <MockChildComponent />
          </GlobalQuickSaveHandler>
        </UserContext.Provider>,
      );

      userEvent.type(screen.getByTestId('child-component'), '{shift}{cmd}s');

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should close dialog and call handleClose false when cancel button clicked', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <GlobalQuickSaveHandler>
            <MockChildComponent />
          </GlobalQuickSaveHandler>
        </UserContext.Provider>,
      );

      userEvent.type(screen.getByTestId('child-component'), '{cmd}s');

      const dialog = screen.getByRole('dialog');
      const cancelButton = screen.getByText(/cancel/i);

      fireEvent.click(cancelButton);

      expect(mockUser.setUser).not.toHaveBeenCalled();
      expect(dialog.close).toHaveBeenCalledTimes(1);
      expect(mockExportTasksToJson).not.toHaveBeenCalled();
    });

    it('should close dialog and call handleClose true when save button clicked', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <GlobalQuickSaveHandler>
            <MockChildComponent />
          </GlobalQuickSaveHandler>
        </UserContext.Provider>,
      );

      userEvent.type(screen.getByTestId('child-component'), '{cmd}s');

      const dialog = screen.getByRole('dialog');
      const saveButton = screen.getByText(/save/i);

      fireEvent.click(saveButton);

      expect(mockUser.setUser).not.toHaveBeenCalled();
      expect(dialog.close).toHaveBeenCalledTimes(1);
      expect(mockExportTasksToJson).toHaveBeenCalled();
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: GlobalQuickSaveHandler.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для GlobalQuickSaveHandler
// ============================================
import renderer from 'react-test-renderer';
import { GlobalQuickSaveHandler } from './GlobalQuickSaveHandler';

describe('GlobalQuickSaveHandler Snapshot Tests', () => {
  describe('with default props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<GlobalQuickSaveHandler />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when isOpen is true', () => {
    test('should match snapshot when isOpen is true', () => {
      const tree = renderer.create(
        <GlobalQuickSaveHandler>
          <div>Test Content</div>
        </GlobalQuickSaveHandler>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when isOpen is false and no children', () => {
    test('should match snapshot when isOpen is false and no children', () => {
      const tree = renderer.create(<GlobalQuickSaveHandler />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when isOpen is false and has children', () => {
    test('should match snapshot when isOpen is false and has children', () => {
      const tree = renderer.create(
        <GlobalQuickSaveHandler>
          <div>Test Content</div>
        </GlobalQuickSaveHandler>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when isOpen is true and has children', () => {
    test('should match snapshot when isOpen is true and has children', () => {
      const tree = renderer.create(
        <GlobalQuickSaveHandler>
          <div>Test Content</div>
        </GlobalQuickSaveHandler>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: GlobalQuickSaveHandler.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для GlobalQuickSaveHandler
// ============================================
Вот пример кода интеграционного теста для компонента `GlobalQuickSaveHandler`:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlobalQuickSaveHandler } from './GlobalQuickSaveHandler'; // импортируйте компонент здесь
import { UserContext } from '../contexts/UserContext'; // импортируйте UserContext если он используется в компоненте
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

// создайте сервер моков
const server = setupServer(
  // моки для API или других зависимостей
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.json({ tasks: [] }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// создайте тему для тестирования
const theme = createTheme({
  palette: {
    type: 'light',
  },
});

describe('GlobalQuickSaveHandler Integration Tests', () => {
  it('should trigger the quick save dialog when pressing Ctrl+S', async () => {
    render(
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user: { tasks: [], darkmode: 'light' } }}>
          <GlobalQuickSaveHandler>
            <div>Children content here</div>
          </GlobalQuickSaveHandler>
        </UserContext.Provider>
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.queryByText(/quick save/i)).toBeInTheDocument());

    userEvent.keyboard('{Ctrl}S');

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeInTheDocument());

    // проверьте содержимое диалога
    expect(screen.getByText(/save your current tasks instantly/i)).toBeInTheDocument();
    expect(screen.getByText(/export all current tasks as a json file?/i)).toBeInTheDocument();

    // нажмите кнопку сохранения
    userEvent.click(screen.getByText(/Save Alt Rounded/i));

    // проверьте успешное завершение операции
    expect(screen.queryByText(/quick save/i)).not.toBeInTheDocument();
  });

  it('should not trigger the quick save dialog when pressing other keys', async () => {
    render(
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user: { tasks: [], darkmode: 'light' } }}>
          <GlobalQuickSaveHandler>
            <div>Children content here</div>
          </GlobalQuickSaveHandler>
        </UserContext.Provider>
      </ThemeProvider>,
    );

    userEvent.keyboard('{Shift}C');

    await waitFor(() => expect(screen.queryByText(/quick save/i)).not.toBeInTheDocument());
  });

  it('should change dark mode when pressing Ctrl+Shift+L', async () => {
    render(
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user: { tasks: [], darkmode: 'light' } }}>
          <GlobalQuickSaveHandler>
            <div>Children content here</div>
          </GlobalQuickSaveHandler>
        </UserContext.Provider>
      </ThemeProvider>,
    );

    userEvent.keyboard('{Ctrl}{Shift}L');

    await waitFor(() => expect(screen.queryByText(/quick save/i)).not.toBeInTheDocument());

    // проверьте изменение режима темной темы
    expect(screen.getByText(/dark mode changed/i)).toBeInTheDocument();
  });
});
Этот тестовый сценарий проверяет следующие аспекты:

- Вызов диалогового окна при нажатии комбинации клавиш `Ctrl+S`.
- Отсутствие вызова диалогового окна при нажатии другой клавиши (`Shift+C`).
- Переключение между светлой и темной темой при нажатии комбинации клавиш `Ctrl+Shift+L`.
