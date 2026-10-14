import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import CategorySelect from './CategorySelect';
import { UserContext } from '../../contexts/UserContext';
import { ColorPalette } from '../../theme/themeConfig';
import { useSystemTheme } from '../../hooks/useSystemTheme';
import { useToasterStore } from 'react-hot-toast';

jest.mock('../../hooks/useSystemTheme');
jest.mock('react-hot-toast');

const mockUser = {
  categories: [],
  emojisStyle: {},
  favoriteCategories: []
};

const mockUseSystemTheme = jest.fn().mockReturnValue({
  darkmode: false,
  palette: {
    secondary: {
      main: '#ff0000'
    }
  }
});

const mockUseToasterStore = jest.fn();

describe('CategorySelect', () => {
  beforeEach(() => {
    useSystemTheme.mockImplementation(mockUseSystemTheme);
    useToasterStore.mockImplementation(mockUseToasterStore);
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser }}>
            <CategorySelect />
          </UserContext.Provider>
        </MemoryRouter>
      );
      expect(screen.getByText(/Category/i)).toBeInTheDocument();
    });

    it('renders with provided width prop', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser }}>
            <CategorySelect width="50%" />
          </UserContext.Provider>
        </MemoryRouter>
      );
      const select = screen.getByRole('combobox');
      expect(select.style.width).toEqual('50%');
    });

    it('renders with custom fontColor prop', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser }}>
            <CategorySelect fontColor="#00ff00" />
          </UserContext.Provider>
        </MemoryRouter>
      );
      const formLabel = screen.getByText(/Category/i);
      expect(formLabel.style.color).toEqual('#00ff00e8');
    });

    it('displays empty message when no categories are available', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: { ...mockUser, categories: [] } }}>
            <CategorySelect />
          </UserContext.Provider>
        </MemoryRouter>
      );
      expect(screen.getByText(/You don't have any categories/i)).toBeInTheDocument();
    });

    it('selects and deselects categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Test Category 1', color: '#00ff00' },
        { id: '2', name: 'Test Category 2', color: '#ff0000' }
      ];

      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: { ...mockUser, categories: mockCategories } }}>
            <CategorySelect />
          </UserContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        userEvent.click(select);
      });

      const menuItem1 = screen.getByText(/Test Category 1/i);
      const menuItem2 = screen.getByText(/Test Category 2/i);

      userEvent.click(menuItem1);
      userEvent.click(menuItem2);

      expect(screen.queryAllByText(/Test Category 1/i)).toHaveLength(1);
      expect(screen.queryAllByText(/Test Category 2/i)).toHaveLength(1);
    });
  });

  describe('Events', () => {
    it('handles category change correctly', async () => {
      const mockOnCategoryChange = jest.fn();
      const mockCategories = [
        { id: '1', name: 'Test Category 1', color: '#00ff00' },
        { id: '2', name: 'Test Category 2', color: '#ff0000' }
      ];

      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: { ...mockUser, categories: mockCategories } }}>
            <CategorySelect onCategoryChange={mockOnCategoryChange} />
          </UserContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        userEvent.click(select);
      });

      const menuItem1 = screen.getByText(/Test Category 1/i);
      const menuItem2 = screen.getByText(/Test Category 2/i);

      userEvent.click(menuItem1);
      userEvent.click(menuItem2);

      expect(mockOnCategoryChange).toHaveBeenCalledWith([mockCategories[0], mockCategories[1]]);
    });

    it('prevents adding more than allowed categories', async () {
      const mockOnCategoryChange = jest.fn();
      const mockCategories = [
        { id: '1', name: 'Test Category 1', color: '#00ff00' },
        { id: '2', name: 'Test Category 2', color: '#ff0000' }
      ];

      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: { ...mockUser, categories: mockCategories } }}>
            <CategorySelect onCategoryChange={mockOnCategoryChange} />
          </UserContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        userEvent.click(select);
      });

      const menuItem1 = screen.getByText(/Test Category 1/i);
      const menuItem2 = screen.getByText(/Test Category 2/i);

      userEvent.click(menuItem1);
      userEvent.click(menuItem2);

      // Attempt to add a third category which should fail
      const menuItem3 = screen.getByText(/Test Category 3/i);
      userEvent.click(menuItem3);

      expect(mockOnCategoryChange).not.toHaveBeenCalledWith([...mockCategories, { id: '3' }]);
    });
  });

  describe('Interaction with children components', () => {
    it('passes correct props to child components', () => {
      const mockCategories = [
        { id: '1', name: 'Test Category 1', color: '#00ff00' },
        { id: '2', name: 'Test Category 2', color: '#ff0000' }
      ];

      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: { ...mockUser, categories: mockCategories } }}>
            <CategorySelect />
          </UserContext.Provider>
        </MemoryRouter>
      );

      const select = screen.getByRole('combobox');
      userEvent.click(select);

      const menuItem1 = screen.getByText(/Test Category 1/i);
      const menuItem2 = screen.getByText(/Test Category 2/i);

      expect(menuItem1.props['tabIndex']).toEqual(0);
      expect(menuItem2.props['tabIndex']).toEqual(0);
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: CategorySelect.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для CategorySelect
// ============================================
import renderer from 'react-test-renderer';
import { CategorySelect } from './CategorySelect';

describe('CategorySelect Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<CategorySelect />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Selected Categories', () => {
    const selectedCategories = [
      { id: '1', name: 'Test Category 1', color: '#ff0000' },
      { id: '2', name: 'Test Category 2', color: '#00ff00' },
    ];

    test('should match snapshot with selected categories', () => {
      const tree = renderer.create(
        <CategorySelect selectedCategories={selectedCategories} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Empty Selected Categories', () => {
    test('should match snapshot with empty selected categories', () => {
      const tree = renderer.create(<CategorySelect selectedCategories=[] />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Custom Width', () => {
    test('should match snapshot with custom width prop', () => {
      const tree = renderer.create(
        <CategorySelect width={'300px'} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Font Color Prop', () => {
    test('should match snapshot with font color prop', () => {
      const tree = renderer.create(
        <CategorySelect fontColor={'#000000'} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Favorite Categories', () => {
    const favoriteCategories = ['1'];
    const categories = [
      { id: '1', name: 'Test Category 1', color: '#ff0000', emoji: '🌿' },
      { id: '2', name: 'Test Category 2', color: '#00ff00', emoji: '💚' },
    ];

    test('should match snapshot with favorite categories', () => {
      const tree = renderer.create(
        <CategorySelect
          selectedCategories={[categories[0]]}
          categories={categories}
          favoriteCategories={favoriteCategories}
        />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Maximum Categories', () => {
    const selectedCategories = [
      { id: '1', name: 'Test Category 1', color: '#ff0000' },
      { id: '2', name: 'Test Category 2', color: '#00ff00' },
      { id: '3', name: 'Test Category 3', color: '#0000ff' },
    ];

    test('should match snapshot when maximum number of categories reached', () => {
      const tree = renderer.create(
        <CategorySelect
          selectedCategories={selectedCategories}
          onCategoryChange={() => {}}
        />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: CategorySelect.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для CategorySelect
// ============================================
Ниже представлен пример кода интеграционного теста компонента `CategorySelect`. В этом примере используется библиотека MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategorySelect } from './CategorySelect'; // импортируйте компонент здесь
import { UserContext } from '../contexts/UserContext'; // импортируйте контекст пользователя
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore'; // импортируйте конфигурацию хранилища Redux
import { ThemeProvider } from '@emotion/styled';
import { createTheme } from '@mui/material/styles';

// создайте сервер MSW для мокирования API
const server = setupServer(
  rest.get('/api/categories', (req, res, ctx) => {
    return res(ctx.json([
      { id: 'c1', name: 'Category 1', color: '#ff0000' },
      { id: 'c2', name: 'Category 2', color: '#00ff00' },
      { id: 'c3', name: 'Category 3', color: '#0000ff' },
    ]));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// создайте mock context для UserContext
const mockUserContext = {
  user: {
    categories: [
      { id: 'c1', name: 'Category 1', color: '#ff0000' },
      { id: 'c2', name: 'Category 2', color: '#00ff00' },
      { id: 'c3', name: 'Category 3', color: '#0000ff' },
    ],
    emojisStyle: {},
    favoriteCategories: ['c1'],
  },
};

// создайте mock store для Redux
const mockStore = configureStore({
  user: mockUserContext.user,
});

// создайте тему MUI
const theme = createTheme({
  palette: {
    secondary: {
      main: '#000',
    },
  },
});

test('renders the component correctly', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Provider store={mockStore}>
        <ThemeProvider theme={theme}>
          <UserContext.Provider value={mockUserContext}>
            <CategorySelect
              selectedCategories={[{ id: 'c1' }]}
              onCategoryChange={(categories) => console.log(categories)}
            />
          </UserContext.Provider>
        </ThemeProvider>
      </Provider>
    </MemoryRouter>,
  );

  await waitFor(() => expect(screen.queryByRole('menu')).toBeInTheDocument());

  // проверьте отображение категорий в меню
  const menuItems = screen.queryAllByRole('menuitem');
  expect(menuItems).toHaveLength(3); // ожидаем три категории

  // выберите категорию из списка
  userEvent.click(menuItems[1]);

  // проверьте изменения в выбранных категориях
  await waitFor(() => expect(mockStore.getState().user.selectedCategories).toEqual(['c1', 'c2']));
});
Этот пример демонстрирует базовый подход к написанию интеграционного теста для компонента `CategorySelect`. Он включает настройку MSW сервера, создание mock-контекста и mock-хранилища Redux, а также проверку корректного отображения данных и поведения компонента при взаимодействии с пользователем.
