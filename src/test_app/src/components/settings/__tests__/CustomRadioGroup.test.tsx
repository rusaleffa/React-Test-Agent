import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CustomRadioGroup from './CustomRadioGroup';  

describe('CustomRadioGroup component', () => {
  let props;

  beforeEach(() => {
    props = {
      options: [
        { value: 'option1', label: 'Option 1', icon: <span data-testid='icon1' />, },
        { value: 'option2', label: 'Option 2', icon: <span data-testid='icon2' />, },
        { value: 'option3', label: 'Option 3', icon: <span data-testid='icon3' />, },
      ],
      value: 'option1',
      onChange: jest.fn(),
    };
  });

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<CustomRadioGroup {...props} />);

      expect(screen.getByRole('radio-group')).toBeInTheDocument();
      expect(screen.queryAllByRole('radio').length).toEqual(props.options.length);
      expect(screen.getByTestId('icon1')).toBeInTheDocument();
      expect(screen.getByTestId('icon2')).toBeInTheDocument();
      expect(screen.getByTestId('icon3')).toBeInTheDocument();
    });

    it('handles disabled options', () => {
      props.disabledOptions = ['option2'];
      render(<CustomRadioGroup {...props} />);

      expect(screen.getByRole('radio', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.queryByRole('radio', { name: 'Option 2' })).not.toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Option 3' })).toBeInTheDocument();
    });

    it('updates state when a radio button is clicked', async () => {
      render(<CustomRadioGroup {...props} />);

      await userEvent.click(screen.getByRole('radio', { name: 'Option 2' }));

      expect(props.onChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates between radio buttons using arrow keys', async () => {
      render(<CustomRadioGroup {...props} />);

      await userEvent.tab();
      await userEvent.keyboard('{ArrowRight}');

      expect(screen.getByRole('radio', { name: 'Option 2' })).toHaveFocus();
    });

    it('highlights the currently focused option', async () => {
      render(<CustomRadioGroup {...props} />);

      await userEvent.tab();
      await userEvent.keyboard('{ArrowRight}');

      expect(screen.getByRole('radio', { name: 'Option 2' }).closest('.MuiFormControlLabel-root')).toHaveStyleRule('border', '1px solid');
    });
  });

  describe('Focus Hint', () => {
    it('displays focus hint when focused and keyboard focus is active', () => {
      render(<CustomRadioGroup {...props} />);

      userEvent.tab();
      userEvent.keyboard('{ArrowRight}');

      expect(screen.getByText(/Navigate with arrow keys/i)).toBeInTheDocument();
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: handleKeyDown.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для handleKeyDown
// ============================================
import renderer from 'react-test-renderer';
import { CustomRadioGroup } from './CustomRadioGroup'; // Импортируйте компонент здесь

describe('CustomRadioGroup Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<CustomRadioGroup />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Options', () => {
    const options = [
      { value: 'Option 1', label: 'Option One', icon: <span>🔥</span> },
      { value: 'Option 2', label: 'Option Two', icon: <span>⚡️</span> },
      { value: 'Option 3', label: 'Option Three', icon: <span>💻</span> },
    ];

    test('should match snapshot with provided options', () => {
      const tree = renderer.create(
        <CustomRadioGroup options={options} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Disabled Options', () => {
    const options = [
      { value: 'Option 1', label: 'Option One', icon: <span>🔥</span> },
      { value: 'Option 2', label: 'Option Two', icon: <span>⚡️</span> },
      { value: 'Option 3', label: 'Option Three', icon: <span>💻</span> },
    ];

    test('should match snapshot with some disabled options', () => {
      const tree = renderer.create(
        <CustomRadioGroup options={options} disabledOptions={['Option 2']} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Focused Value', () => {
    const options = [
      { value: 'Option 1', label: 'Option One', icon: <span>🔥</span> },
      { value: 'Option 2', label: 'Option Two', icon: <span>⚡️</span> },
      { value: 'Option 3', label: 'Option Three', icon: <span>💻</span> },
    ];

    test('should match snapshot when focused value is present', () => {
      const tree = renderer.create(
        <CustomRadioGroup options={options} value='Option 2' />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Keyboard Focus', () => {
    const options = [
      { value: 'Option 1', label: 'Option One', icon: <span>🔥</span> },
      { value: 'Option 2', label: 'Option Two', icon: <span>⚡️</span> },
      { value: 'Option 3', label: 'Option Three', icon: <span>💻</span> },
    ];

    test('should match snapshot when keyboard focus is active', () => {
      const tree = renderer.create(
        <CustomRadioGroup options={options} value='Option 2' disabledOptions={['Option 1']}>
          <FocusHint />
        </CustomRadioGroup>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: handleKeyDown.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для handleKeyDown
// ============================================
Вот пример кода интеграционного теста для компонента `CustomRadioGroup` с использованием MSW и `@testing-library/react`. Предполагается, что компонент взаимодействует только через DOM и не имеет внешних зависимостей или API.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomRadioGroup from './CustomRadioGroup'; // импортируйте реальный путь к вашему компоненту

const server = setupServer(
  // если ваш компонент использует внешний API, добавьте мок здесь
  // например:
  // rest.get('/api/data', (req, res, ctx) => res(ctx.json({ data: ['Option A', 'Option B'] })))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CustomRadioGroup Integration Tests', () => {
  it('renders correctly when no props are provided', async () => {
    render(<CustomRadioGroup options={[{ value: 'Option A' }, { value: 'Option B' }]} />);

    expect(screen.queryByText(/Option A/i)).toBeInTheDocument();
    expect(screen.queryByText(/Option B/i)).toBeInTheDocument();
  });

  it('handles keyboard focus properly', async () => {
    render(<CustomRadioGroup options={[{ value: 'Option A' }, { value: 'Option B' }]} />);

    await userEvent.tab(); // имитируем нажатие Tab
    expect(screen.queryByText(/Navigate with arrow keys/i)).toBeInTheDocument();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.queryByText(/Option B/i)).toBeInTheDocument();
  });

  it('selects a radio button by clicking', async () => {
    render(<CustomRadioGroup options={[{ value: 'Option A' }, { value: 'Option B' }]} />);

    await userEvent.click(screen.getByRole('radio', { name: /Option A/i }));
    expect(screen.queryByDisplayValue('Option A')).toBeInTheDocument();
  });

  it('selects a radio button by pressing Enter', async () => {
    render(<CustomRadioGroup options={[{ value: 'Option A' }, { value: 'Option B' }]} />);

    await userEvent.type(screen.getByRole('radio', { name: /Option A/i }), '{Enter}');
    expect(screen.queryByDisplayValue('Option A')).toBeInTheDocument();
  });

  it('does not allow selection of disabled option', async () => {
    render(
      <CustomRadioGroup
        options={[{ value: 'Option A', disabled: true }, { value: 'Option B' }]}
      />
    );

    await userEvent.click(screen.getByRole('radio', { name: /Option B/i }));
    expect(screen.queryByDisplayValue('Option B')).toBeInTheDocument();
  });

  it('updates state on change', async () => {
    const onChangeSpy = jest.fn();
    render(
      <CustomRadioGroup
        options={[{ value: 'Option A' }, { value: 'Option B' }]}
        onChange={onChangeSpy}
      />
    );

    await userEvent.click(screen.getByRole('radio', { name: /Option B/i }));
    await waitFor(() => expect(onChangeSpy).toHaveBeenCalledWith('Option B'));
  });
});
Этот набор тестов проверяет следующие аспекты:

- Правильное отображение элементов интерфейса без пропсов.
- Корректное управление фокусировкой клавиатуры.
- Выбор опции при клике на радио-кнопку.
- Выбор опции при нажатии клавиши Enter.
- Невозможность выбора отключенной опции.
- Обновление состояния компонента после изменения значения.

Если в вашем компоненте используется внешнее API или Redux, необходимо добавить соответствующие моки и проверки.
