import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ColorPicker from '../ColorPicker';

describe('ColorPicker', () => {
  let mockSetUser;
  let mockShowToast;

  beforeEach(() => {
    mockSetUser = jest.fn();
    mockShowToast = jest.fn();
    global.showToast = mockShowToast;
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      expect(screen.getByText(/test label/i)).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveStyle({ border: '1px solid rgba(0, 0, 0, 0.23)' });
      expect(screen.getAllByRole('tooltip').length).toEqual(9); // assuming 9 colors in the list
    });

    it('should render with custom width', () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={300} fontColor="#fff" label="Test Label" />);

      expect(screen.getByRole('button')).toHaveStyle({ width: '300px' });
    });

    it('should render with no label', () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" />);

      expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
    });

    it('should render with invalid hex color', () => {
      render(<ColorPicker color="invalid_color" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      expect(mockSetUser).toHaveBeenCalledWith({ ...mockSetUser.mock.calls[0][0], colorList: [] });
      expect(mockShowToast).toHaveBeenCalledWith('Invalid hex color invalid_color');
    });
  });

  describe('Interaction', () => {
    it('should change color on click', async () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      await userEvent.click(screen.getByRole('button'));

      expect(mockShowToast).toHaveBeenCalledWith('Added FF0000 to your color list.');
    });

    it('should open dialog on add button click', async () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      await userEvent.click(screen.getByRole('button', { name: /add new color/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should close dialog on cancel button click', async () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      await userEvent.click(screen.getByRole('button', { name: /add new color/i }));
      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should add color to list', async () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      await userEvent.click(screen.getByRole('button', { name: /add new color/i }));
      await userEvent.type(screen.getByRole('textbox'), 'new_color');
      await userEvent.click(screen.getByRole('button', { name: /set/i }));

      expect(mockShowToast).toHaveBeenCalledWith('Added new_color to your color list.', {
        iconTheme: { primary: 'new_color', secondary: getFontColor('new_color') },
        style: { borderColor: 'new_color' },
      });
    });

    it('should delete color from list', async () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      await userEvent.contextMenu(screen.getByRole('button'));
      await userEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

      expect(mockShowToast).toHaveBeenCalledWith('Removed FF0000 from your color list.');
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      expect(screen.getAllByRole('button')[0]).toHaveAccessibleName('Select color - FF0000');
    });
  });
});

describe('Helper Functions', () => {
  it('should call showToast correctly', () => {
    render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

    userEvent.click(screen.getByRole('button'));

    expect(mockShowToast).toHaveBeenCalledWith('Added FF0000 to your color list.');
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: ColorPicker.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для ColorPicker
// ============================================
import renderer from 'react-test-renderer';
import { ColorPicker } from './ColorPicker'; // импортируйте компонент здесь

describe('ColorPicker Snapshot Tests', () => {
  describe('Basic Rendering Scenarios', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<ColorPicker />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with custom color', () => {
      const tree = renderer.create(<ColorPicker color="#FF0000" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with custom width', () => {
      const tree = renderer.create(<ColorPicker width="200px" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with custom font color', () => {
      const tree = renderer.create(<ColorPicker fontColor="#00FFFF" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with custom label', () => {
      const tree = renderer.create(<ColorPicker label="My Label" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Accordion Expanded State', () => {
    test('should match snapshot with accordion expanded', () => {
      const tree = renderer.create(<ColorPicker accordionExpanded={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Popover Open States', () => {
    test('should match snapshot with first popover open', () => {
      const tree = renderer.create(<ColorPicker popoverOpen={[true, false]} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with second popover open', () => {
      const tree = renderer.create(<ColorPicker popoverOpen=[false, true] />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with both popovers open', () => {
      const tree = renderer.create(<ColorPicker popoverOpen=[true, true] />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Add Dialog Open State', () => {
    test('should match snapshot with add dialog open', () => {
      const tree = renderer.create(<ColorPicker openAddDialog={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Accordion and Popover Combined States', () => {
    test('should match snapshot with accordion expanded and first popover open', () => {
      const tree = renderer.create(
        <ColorPicker accordionExpanded={true} popoverOpen={[true, false]} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with accordion expanded and second popover open', () => {
      const tree = renderer.create(
        <ColorPicker accordionExpanded={true} popoverOpen=[false, true] />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with accordion expanded and both popovers open', () => {
      const tree = renderer.create(
        <ColorPicker accordionExpanded={true} popoverOpen=[true, true] />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: ColorPicker.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для ColorPicker
// ============================================
Ниже приведён пример кода интеграционного тестирования компонента `ColorPicker`. В этом примере используется библиотека MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для выполнения пользовательских взаимодействий и проверки интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContext } from '../contexts/UserContext'; // Предположим, что UserContext доступен здесь
import { ColorPicker } from './ColorPicker'; // Импортируйте компонент для тестирования

// Создаём сервер для мокирования сетевых запросов
const server = setupServer(
  // Моки для имитации API-запросов
  rest.get('/api/colors', (req, res, ctx) => {
    return res(ctx.json([
      { name: 'red', code: '#FF0000' },
      { name: 'blue', code: '#0000FF' },
      { name: 'green', code: '#00FF00' },
    ]))
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Создаём mock store для Redux
const mockStore = createStore(() => ({ /* mock state */ }));

// Настраиваем контекст UserContext
const MockUserContextProvider = ({ children }) => (
  <UserContext.Provider value={{ user: { settings: {} }, setUser: jest.fn() }}>
    {children}
  </UserContext.Provider>
);

describe('ColorPicker Integration Tests', () => {
  it('should load initial colors and display them correctly', async () => {
    render(
      <Provider store={mockStore}>
        <MockUserContextProvider>
          <ColorPicker color="#FF0000" onColorChange={() => {}} />
        </MockUserContextProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/red/i)).toBeInTheDocument());
    expect(screen.queryByText(/red/i)).toBeInTheDocument();
    expect(screen.queryByText(/#FF0000/i)).toBeInTheDocument();
  });

  it('should change color when clicking on another color', async () => {
    render(
      <Provider store={mockStore}>
        <MockUserContextProvider>
          <ColorPicker color="#FF0000" onColorChange={() => {}} />
        </MockUserContextProvider>
      </Provider>
    );

    userEvent.click(screen.getByText(/blue/i)); // Нажимаем на цвет blue
    await waitFor(() => expect(screen.queryByText(/blue/i)).toBeInTheDocument());
    expect(screen.queryByText(/blue/i)).toBeInTheDocument();
  });

  it('should display dialog when adding new color', async () => {
    render(
      <Provider store={mockStore}>
        <MockUserContextProvider>
          <ColorPicker color="#FF0000" onColorChange={() => {}} />
        </MockUserContextProvider>
      </Provider>
    );

    userEvent.click(screen.getByRole('button', { name: /add new color/i }));
    await waitFor(() => expect(screen.queryByText(/choose a color/i)).toBeInTheDocument());
  });

  it('should add new color to list', async () => {
    render(
      <Provider store={mockStore}>
        <MockUserContextProvider>
          <ColorPicker color="#FF0000" onColorChange={() => {}} />
        </MockUserContextProvider>
      </Provider>
    );

    userEvent.click(screen.getByRole('button', { name: /add new color/i }));
    userEvent.type(screen.getByRole('textbox'), 'yellow');
    userEvent.click(screen.getByText(/add/i));

    await waitFor(() => expect(screen.queryByText(/yellow/i)).toBeInTheDocument());
  });

  it('should delete existing color from list', async () => {
    render(
      <Provider store={mockStore}>
        <MockUserContextProvider>
          <ColorPicker color="#FF0000" onColorChange={() => {}} />
        </MockUserContextProvider>
      </Provider>
    );

    userEvent.click(screen.getByText(/blue/i));
    userEvent.contextMenu(screen.getByText(/blue/i));
    userEvent.click(screen.getByText(/delete/i));

    await waitFor(() => expect(screen.queryByText(/blue/i)).not.toBeInTheDocument());
  });
});
Этот пример демонстрирует основные сценарии интеграции для компонента `ColorPicker`, включая проверку начальной загрузки цветов, изменение цвета при клике, открытие диалогового окна добавления нового цвета, добавление нового цвета в список и удаление существующего цвета из списка. Обратите внимание, что реальные реализации могут отличаться от этого примера в зависимости от структуры вашего приложения и используемых библиотек.
