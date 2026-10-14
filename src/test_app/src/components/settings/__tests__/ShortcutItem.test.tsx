import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ShortcutItem } from '../ShortcutItem';

describe('ShortcutItem', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <ShortcutItem
          name="Test Name"
          keys={['Cmd', 'Shift', 'A']}
        />
      );

      expect(screen.getByText(/test name/i)).toBeInTheDocument();
      expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
      const keyComboElement = screen.getByText('⌘ShiftA');
      expect(keyComboElement).toBeInTheDocument();
    });

    it('should render with description prop', () => {
      render(
        <ShortcutItem
          name="Test Name"
          description="This is a test description"
          keys={['Cmd', 'Shift', 'A']}
        />
      );

      expect(screen.getByText(/test name/i)).toBeInTheDocument();
      expect(screen.getByText(/this is a test description/i)).toBeInTheDocument();
      expect(screen.getByText('⌘ShiftA')).toBeInTheDocument();
    });

    it('should handle empty keys array', () => {
      render(
        <ShortcutItem
          name="Test Name"
          keys=[]
        />
      );

      expect(screen.getByText(/test name/i)).toBeInTheDocument();
      expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
      expect(screen.queryByText('⌘')).not.toBeInTheDocument();
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: Component.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Component
// ============================================
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/core/ThemeProvider';

// Пример темы для тестирования
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  darkmode: false,
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  darkmode: true,
});

describe('ShortcutItem Snapshots', () => {
  // Светлая тема
  test('should match snapshot in light theme with default props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <ShortcutItem name="Test Name" keys={['Cmd', 'Shift', 'A']} />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in light theme with custom description', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <ShortcutItem
            name="Test Name"
            description="This is a test description."
            keys={['Cmd', 'Shift', 'A']}
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Темная тема
  test('should match snapshot in dark theme with default props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <ShortcutItem name="Test Name" keys={['Cmd', 'Shift', 'A']} />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in dark theme with custom description', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <ShortcutItem
            name="Test Name"
            description="This is a test description."
            keys={['Cmd', 'Shift', 'A']}
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: Component.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Component
// ============================================
Ниже приведён пример кода интеграционного теста компонента `ShortcutItem` в формате TypeScript с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/core';
import { ShortcutItem } from './ShortcutItem'; // импортируйте компонент здесь

// Создайте сервер MSW для мокирования сетевого запроса
const server = setupServer(
  rest.get('/shortcuts', (req, res, ctx) => {
    return res(ctx.json({
      shortcuts: [
        {
          name: 'Short Name',
          description: 'Description of the shortcut',
          keys: ['Cmd', 'Shift', 'A']
        }
      ]
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Определите тему MUI
const theme = createTheme();

// Интеграционный тест компонента ShortcutItem
describe('ShortcutItem component integration test', () => {
  it('should render correctly with props', async () => {
    const props = {
      name: 'Short Name',
      description: 'Description of the shortcut',
      keys: ['Cmd', 'Shift', 'A']
    };

    // Отрендерим компонент с заданными пропсами
    render(
      <ThemeProvider theme={theme}>
        <ShortcutItem {...props} />
      </ThemeProvider>
    );

    // Ожидаем завершения рендера
    await waitFor(() => expect(screen.queryByRole('listitem')).toBeInTheDocument());

    // Проверяем отображение текста названия
    expect(screen.getByText(props.name)).toBeInTheDocument();

    // Проверяем наличие описания
    if (props.description) {
      expect(screen.getByText(props.description)).toBeInTheDocument();
    }

    // Проверяем отображение комбинации клавиш
    expect(screen.getByText('⌘')).toBeInTheDocument();
    expect(screen.getByText('Shift')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
### Пояснение к коду:

1. **Настройка MSW**: Используется библиотека MSW для создания сервера, который будет мочить ответы на запросы к API.
   
2. **Настройка провайдера тем**: Компонент использует тему из пакета `@mui/material`, поэтому мы используем `ThemeProvider` для правильной отрисовки стилей.

3. **Тестирование рендера**: Мы проверяем корректность отображения всех элементов, таких как название, описание и комбинация клавиш.

4. **Ожидание завершения рендера**: Для того чтобы убедиться, что компоненты полностью отрендерились, используется метод `waitFor`.

Этот подход позволяет проверить полный жизненный цикл компонента — от получения данных через API до правильного отображения информации пользователю.
