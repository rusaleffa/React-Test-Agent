import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Accordion from '../Accordion';
import { IGetRolesItem } from 'src/shared/store/api/users/users.types';

const mockData = [
  { name: 'role1', info: 'info1' },
  { name: 'role2', info: 'info2' },
];

const mockCheckedList = ['role1'];

describe('Accordion', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <Accordion
          title="Test Title"
          disabled={false}
          data={mockData}
          checkedList={mockCheckedList}
        />
      );

      expect(screen.getByText(/test title/i)).toBeInTheDocument();
      expect(screen.queryAllByRole('checkbox')).toHaveLength(2);
      expect(screen.getByText(/info1/i)).toBeInTheDocument();
      expect(screen.getByText(/info2/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox').checked).toEqual(true);
    });

    it('should render with disabled prop', () => {
      render(
        <Accordion
          title="Test Title"
          disabled={true}
          data={mockData}
          checkedList={[]}
        />
      );

      expect(screen.getByText(/test title/i)).toBeInTheDocument();
      expect(screen.queryAllByRole('checkbox')).toHaveLength(2);
      expect(screen.getByText(/info1/i)).toBeInTheDocument();
      expect(screen.getByText(/info2/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox').disabled).toEqual(true);
    });

    it('should render without data', () => {
      render(<Accordion title="Test Title" disabled={false} data={[]} checkedList={[]} />);

      expect(screen.getByText(/test title/i)).toBeInTheDocument();
      expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });
  });

  describe('Обработка событий', () => {
    it('should handle click event', async () => {
      render(
        <Accordion
          title="Test Title"
          disabled={false}
          data={mockData}
          checkedList={[]}
        />
      );

      await userEvent.click(screen.getByRole('checkbox'));

      expect(screen.getByRole('checkbox').checked).toEqual(true);
    });
  });

  describe('Проверки пропсов дочерних компонентов', () => {
    it('should pass correct props to children', () => {
      render(
        <Accordion
          title="Test Title"
          disabled={false}
          data={mockData}
          checkedList={['role1']}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.props.disabled).toEqual(false);
      expect(checkbox.props.checked).toEqual(true);
      expect(checkbox.props.sx).toMatchObject({
        '&.Mui-disabled': {
          color: '#0F74FF',
          opacity: 1,
        },
      });
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: Accordion.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Accordion
// ============================================
import renderer from 'react-test-renderer';
import { Accordion } from './Accordion';

describe('Accordion Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<Accordion />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Data and Checked List', () => {
    const data = [
      { name: 'role1', info: 'info1' },
      { name: 'role2', info: 'info2' },
    ];
    const checkedList = ['role1'];

    test('should match snapshot with data and checked list', () => {
      const tree = renderer.create(
        <Accordion
          title="Test Title"
          data={data}
          checkedList={checkedList}
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Disabled State', () => {
    const data = [
      { name: 'role1', info: 'info1' },
      { name: 'role2', info: 'info2' },
    ];
    const checkedList = [];

    test('should match snapshot in disabled state', () => {
      const tree = renderer.create(
        <Accordion
          title="Test Title"
          disabled
          data={data}
          checkedList={checkedList}
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match snapshot in loading state', () => {
      const tree = renderer.create(<Accordion title="Test Title" loading />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    test('should match snapshot in error state', () => {
      const tree = renderer.create(<Accordion title="Test Title" error />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: Accordion.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Accordion
// ============================================
Ниже представлен пример кода интеграционного теста компонента `Accordion` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux'; // Предположим, что используется Redux
import configureStore from 'src/store/configureStore'; // Импортируйте конфигурацию вашего хранилища
import { Accordion } from './Accordion'; // импортируйте компонент Accordion

// Создайте сервер MSW для мокирования сетевого вызова
const server = setupServer(
  rest.get('/api/data', (req, res, ctx) =>
    res(ctx.json({
      data: [
        { name: 'role1', info: 'info1' },
        { name: 'role2', info: 'info2' },
        { name: 'role3', info: 'info3' },
      ],
    }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Создайте хранилище Redux
const store = configureStore();

describe('Accordion Integration', () => {
  it('should fetch and display data', async () => {
    render(
      <Provider store={store}>
        <Accordion
          title="Test Title"
          disabled={false}
          data={[]} // данные будут загружены из API
          checkedList=[]
        />
      </Provider>
    );

    // Ожидание завершения сетевого запроса
    await waitFor(() => expect(screen.queryByText(/info1/i)).not.toBeNull());
    await waitFor(() => expect(screen.queryByText(/info2/i)).not.toBeNull());
    await waitFor(() => expect(screen.queryByText(/info3/i)).not.toBeNull());

    // Проверка заголовков чекбоксов
    expect(screen.getByText('info1')).toHaveAttribute('aria-label', 'role1');
    expect(screen.getByText('info2')).toHaveAttribute('aria-label', 'role2');
    expect(screen.getByText('info3')).toHaveAttribute('aria-label', 'role3');

    // Проверка состояния чекбоксов
    expect(screen.getByRole('checkbox').checked).toEqual(false); // По умолчанию чекбокс не отмечен

    // Проверка заголовка аккордиона
    expect(screen.getByText('Test Title')).toBeInTheDocument();

    // Проверка иконки расширения
    expect(screen.getByTitle('Expand more')).toBeInTheDocument();

    // Проверка состояния инпута при клике на чекбокс
    userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox').checked).toEqual(true);
  });
});
Этот пример демонстрирует базовый подход к интеграционным тестам компонента `Accordion`. В реальных сценариях вам может понадобиться расширить тесты дополнительными проверками состояний загрузки (`loading`), ошибок (`error`) или других событий, связанных с компонентом.
