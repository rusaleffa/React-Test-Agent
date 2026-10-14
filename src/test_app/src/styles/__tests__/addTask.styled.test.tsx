import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Container, AddTaskButton, StyledInput } from '../Container';

describe('Container', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<Container />);
      expect(screen.getByRole('button')).toHaveTextContent('Add Task');
      expect(screen.getByLabelText(/task name/i)).toBeInTheDocument();
    });

    it('should render with custom button text', () => {
      render(<Container buttonText="Custom Button" />);
      expect(screen.getByRole('button')).toHaveTextContent('Custom Button');
    });

    it('should render with disabled button', () => {
      render(<Container isDisabled={true} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should render with different input placeholder', () => {
      render(<Container inputPlaceholder="Enter task here" />);
      expect(screen.getByLabelText(/task name/i)).toHaveAttribute('placeholder', 'Enter task here');
    });
  });

  describe('Обработка событий', () => {
    it('should call handleSubmit when form submitted', () => {
      const mockHandleSubmit = jest.fn();
      render(
        <Container handleSubmit={mockHandleSubmit}>
          <StyledInput />
          <AddTaskButton />
        </Container>
      );
      userEvent.type(screen.getByLabelText(/task name/i), 'Test Task');
      userEvent.click(screen.getByRole('button'));
      expect(mockHandleSubmit).toHaveBeenCalledWith('Test Task');
    });
  });

  describe('Вспомогательные функции', () => {
    it('getFontColor should return correct color based on theme', () => {
      const theme = { primary: '#ff0000' };
      expect(getFontColor('#ff0000')).toEqual('#ffffff');
    });
  });
});

// Mocking for child components if needed
// import { ThemeProvider } from '@emotion/react';
// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//   palette: {
//     primary: '#ff0000',
//     secondary: '#00ff00'
//   }
// });

// function TestApp() {
//   return (
//     <ThemeProvider theme={theme}>
//       <Container />
//     </ThemeProvider>
//   );
// }

// ============================================
// SNAPSHOT TESTS
// Файл: Container.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Container
// ============================================
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/core';

const theme = createTheme({
  primary: '#ffc107',
  secondary: '#3f51b5'
});

describe('Container Snapshot Tests', () => {
  // Базовый снапшот без пропсов
  test('should match snapshot without props', () => {
    const tree = renderer.create(
      <ThemeProvider theme={theme}>
        <Container />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Снапшот с пропсом disabled на true
  test('should match snapshot with disabled prop', () => {
    const tree = renderer.create(
      <ThemeProvider theme={theme}>
        <Container disabled />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Снапшот с пропсом disabled на false
  test('should match snapshot with enabled prop', () => {
    const tree = renderer.create(
      <ThemeProvider theme={theme}>
        <Container />
      </ThemeProvider>
    ).toJSON(); // Повторно используем базовый вариант
    expect(tree).toMatchSnapshot();
  });

  // Снапшот с пропсом helpercolor
  test('should match snapshot with helpercolor prop', () => {
    const tree = renderer.create(
      <ThemeProvider theme={theme}>
        <Container>
          <StyledInput helpercolor="#ff0000" />
        </Container>
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Снапшот с пропсом hidetext
  test('should match snapshot with hidetext prop', () => {
    const tree = renderer.create(
      <ThemeProvider theme={theme}>
        <Container>
          <StyledInput hidetext />
        </Container>
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: Container.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Container
// ============================================
Ниже приведён пример кода интеграционного теста для компонента `Container`, который включает настройку MSW сервера, проверку взаимодействий с Redux и обработку асинхронных событий.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore'; // Предположим, что у вас настроен Redux store
import { Container } from './components/Container';

// Настраиваем сервер MSW
const server = setupServer(
  // Моки API здесь
  rest.get('/api/tasks', (req, res, ctx) =>
    res(ctx.json([
      { id: 1, title: 'Task 1' },
      { id: 2, title: 'Task 2' },
    ]))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Создаём mock store
const initialState = {};
const store = configureStore(initialState);

describe('Container Integration Tests', () => {
  it('should load tasks and display them correctly', async () => {
    render(
      <Provider store={store}>
        <Container />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/Task 1/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/Task 2/i)).toBeInTheDocument());
  });

  it('should handle add task button click', async () => {
    render(
      <Provider store={store}>
        <Container />
      </Provider>
    );

    userEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => expect(screen.queryByDisplayValue('')).toBeInTheDocument());
  });

  it('should show error when input is empty', async () => {
    render(
      <Provider store={store}>
        <Container />
      </Provider>
    );

    userEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => expect(screen.queryByText(/Please enter a valid task/i)).toBeInTheDocument());
  });

  it('should submit task successfully', async () => {
    render(
      <Provider store={store}>
        <Container />
      </Provider>
    );

    userEvent.type(screen.getByRole('textbox'), 'New Task');
    userEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => expect(screen.queryByText(/New Task/i)).toBeInTheDocument());
  });
});
Этот пример демонстрирует базовую структуру интеграционного тестирования компонента `Container`. В реальных сценариях вам может понадобиться расширить тесты, добавив проверки состояний, обработчиков ошибок и других аспектов поведения компонента.
