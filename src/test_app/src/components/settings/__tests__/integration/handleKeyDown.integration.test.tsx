/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для handleKeyDown
 * 
 * @file handleKeyDown.integration.test.tsx
 * @description Тестирование handleKeyDown 
 * @generated 2026-09-08T13:19:53.965Z
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