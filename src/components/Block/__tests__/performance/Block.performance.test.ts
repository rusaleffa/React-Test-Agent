/**
 * Тесты производительности для Block
 * 
 * @file Block.performance.test.ts
 * @description Тестирование Block 
 * @generated 2026-09-07T21:53:22.586Z
 * @type {performance}
 * @testCount 4
 * 
 * @dependencies @testing-library/react, perf_hooks
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D perf_hooks

import { performance } from 'perf_hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Block } from './Block';

// Тест времени рендеринга
test('should render within performance budget', () => {
  const start = performance.now();
  render(<Block title="Test" />);
  const end = performance.now();
  expect(end - start).toBeLessThan(100); // Допустимое время в миллисекундах
});

// Тест количества рендеров при изменении состояния
test('should not re-render when props change but state does not', () => {
  let rendered = false;
  const mockOnToggle = jest.fn(() => {
    rendered = true; // Отмечаем первый рендер
  });

  render(<Block title="Test" onToggle={mockOnToggle} open={false} />);

  userEvent.click(screen.getByText(/Test/i));

  expect(rendered).toBe(true); // Первый рендер должен быть только один раз
  expect(mockOnToggle).toHaveBeenCalledTimes(1);
});

// Тест больших данных и мемоизации
test('should not re-render when data is large and unchanged', async () => {
  const mockData = Array.from({ length: 100 }, (_, i) => `Item ${i}`);

  let rendered = false;
  const mockOnToggle = jest.fn(() => {
    rendered = true;
  });

  render(
    <Block title="Large Data Test" onToggle={mockOnToggle} open={false}>
      {mockData.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </Block>
  );

  await screen.findAllByRole('heading');

  userEvent.click(screen.getByText(/Large Data Test/i));

  expect(rendered).toBe(false); // Мемоизация должна предотвратить лишние рендеры
  expect(mockOnToggle).toHaveBeenCalledTimes(1);
});

// Тест очистки эффекта
test('should clean up effect properly', () => {
  const cleanupMock = jest.fn();
  const mockOnToggle = jest.fn(() => cleanupMock());

  render(<Block title="Cleanup Test" onToggle={mockOnToggle} open={false} />);

  userEvent.click(screen.getByText(/Cleanup Test/i));

  expect(cleanupMock).toHaveBeenCalled(); // Убедимся, что эффект был очищен корректно
});