import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Block from '../Block';

describe('Block', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<Block title="Test" />);
      expect(screen.getByText(/test/i)).toBeInTheDocument();
    });

    it('should render with custom children', () => {
      const child = <div data-testid="child">Child</div>;
      render(<Block title="Test">{child}</Block>);
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should render with hide prop', () => {
      render(<Block title="Test" withHide={true} />);
      expect(screen.queryByRole('button')).not.toBeNull();
    });

    it('should not render hide button if withHide is false', () => {
      render(<Block title="Test" withHide={false} />);
      expect(screen.queryByRole('button')).toBeNull();
    });

    it('should render collapse when open prop is true', () => {
      render(<Block title="Test" open={true}>Content</Block>);
      expect(screen.getByText(/content/i)).toBeInTheDocument();
    });

    it('should not render collapse when open prop is false', () => {
      render(<Block title="Test" open={false}>Content</Block>);
      expect(screen.queryByText(/content/i)).toBeNull();
    });
  });

  describe('Обработка событий', () => {
    let mockOnToggle;
    beforeEach(() => {
      mockOnToggle = jest.fn();
    });

    it('should call onToggle when click on title', async () => {
      render(<Block title="Test" onToggle={mockOnToggle} open={false} />);
      await userEvent.click(screen.getByText(/test/i));
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should change state of block and collapse', async () => {
      render(<Block title="Test" onToggle={mockOnToggle} open={false} >Content</Block>);
      await userEvent.click(screen.getByText(/test/i));
      expect(screen.getByText(/content/i)).toBeInTheDocument();
    });
  });

  describe('Вспомогательные функции', () => {
    it('should have correct icon rotation', () => {
      render(<Block title="Test" open={true} onToggle={() => {}} withHide={true} />);
      const icon = screen.getByRole('button');
      expect(icon.firstChild.style.transform).toEqual('rotate(0deg)');

      render(<Block title="Test" open={false} onToggle={() => {}} withHide={true} />);
      expect(icon.firstChild.style.transform).toEqual('rotate(180deg)');
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: Block.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Block
// ============================================
import renderer from 'react-test-renderer';
import { Block } from './Block';

describe('Block Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<Block />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Title and Open', () => {
    test('should match snapshot with title and open state', () => {
      const tree = renderer.create(<Block title="Test Title" open={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Title and Closed', () => {
    test('should match snapshot with title and closed state', () => {
      const tree = renderer.create(<Block title="Test Title" open={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Hide Button', () => {
    test('should match snapshot with hide button', () => {
      const tree = renderer.create(<Block title="Test Title" withHide={true} open={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Without Hide Button', () => {
    test('should match snapshot without hide button', () => {
      const tree = renderer.create(<Block title="Test Title" withHide={false} open={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With ID Prop', () => {
    test('should match snapshot with id prop', () => {
      const tree = renderer.create(<Block title="Test Title" id="test-id" open={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Children Content', () => {
    test('should match snapshot with child content', () => {
      const tree = renderer.create(
        <Block title="Test Title">
          <div>Child Content</div>
        </Block>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: Block.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Block
// ============================================
Ниже приведён пример кода интеграционного теста компонента `Block` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Block } from './Block'; // импортируйте компонент здесь

// Моки серверного запроса
const server = setupServer(
  rest.get('/api/data', (req, res, ctx) =>
    res(ctx.json({ data: ['item1', 'item2'] }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Block Integration Tests', () => {
  it('renders block component correctly', async () => {
    render(<Block title="Test Block" />);

    expect(screen.queryByText(/test block/i)).toBeInTheDocument(); // проверим отображение заголовка блока
  });

  it('collapses and expands the content when clicked', async () => {
    render(<Block title="Test Block" children={<div>Content</div>} open={false} />);

    await waitFor(() => {
      userEvent.click(screen.getByRole('button')); // имитируем клик на кнопку открытия
    });

    expect(screen.queryByText(/content/i)).toBeInTheDocument(); // проверим отображение контента после клика
  });

  it('handles toggle state properly', async () => {
    render(<Block title="Test Block" children={<div>Content</div>} open={true} />);

    await waitFor(() => {
      userEvent.click(screen.getByRole('button'));
    });

    expect(screen.queryByText(/content/i)).not.toBeInTheDocument(); // проверим исчезновение контента при закрытии
  });

  it('fetches data from API and renders it', async () => {
    render(<Block title="Test Data Fetching" />);

    await waitFor(() => {
      userEvent.click(screen.getByRole('button')); // имитируем клик на кнопку открытия
    });

    expect(await screen.findByText(/item1/i)).toBeInTheDocument(); // проверим наличие данных из API
    expect(await screen.findByText(/item2/i)).toBeInTheDocument();
  });
});
Этот набор тестов охватывает следующие аспекты:

- Базовое отображение компонента без контента.
- Взаимодействие пользователя с кнопкой раскрытия и проверки отображения содержимого.
- Правильное переключение состояния блока между открытым и закрытым состоянием.
- Загрузку данных через API и проверку их корректного отображения в блоке.

Обратите внимание, что тесты используют библиотеку `@testing-library/user-event`, чтобы симулировать реальные действия пользователей, такие как нажатие кнопки или открытие/закрытие блока.
