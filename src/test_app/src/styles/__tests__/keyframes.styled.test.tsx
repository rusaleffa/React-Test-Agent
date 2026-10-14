import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { keyframes } from '@emotion/react';
import fadeInLeft from '../fadeInLeft';

describe('fadeInLeft', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<fadeInLeft />);
      expect(screen.queryByRole('presentation')).toBeInTheDocument();
    });

    it('should render with custom duration prop', () => {
      render(<fadeInLeft duration="2s" />);
      expect(screen.queryByRole('presentation')).toHaveStyle({
        animationDuration: '2s',
      });
    });

    it('should render with custom delay prop', () => {
      render(<fadeInLeft delay="1s" />);
      expect(screen.queryByRole('presentation')).toHaveStyle({
        animationDelay: '1s',
      });
    });

    it('should render with custom timing function prop', () => {
      render(<fadeInLeft timingFunction="ease-in-out" />);
      expect(screen.queryByRole('presentation')).toHaveStyle({
        animationTimingFunction: 'ease-in-out',
      });
    });
  });
});

describe('keyframes', () => {
  it('should have correct keyframes structure', () => {
    const keyframe = keyframes`
      from {
        opacity: 0;
        transform: translateX(-40px);
      }
      to {
        opacity: 1;
        transform: translateX(0px);
      }
    `;

    expect(keyframe).toMatchSnapshot();
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: fadeInLeft.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для fadeInLeft
// ============================================
import renderer from 'react-test-renderer';

// Пример простого компонента с одним пропсом
const FadeInLeftWithPropTest = ({ propName }) => <div>Content</div>;

describe('fadeInLeft Snapshot Tests', () => {
  // Тестирование различных значений пропа
  test('should match snapshot with different prop values', () => {
    const tree = renderer.create(
      <FadeInLeftWithPropTest propName="test" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тестирование состояний загрузки и ошибки
  test('should match loading state snapshot', () => {
    const tree = renderer.create(<fadeInLeft isLoading={true} />).toJSON();
    expect(tree).toMatchSnapshot('loading');
  });

  test('should match error state snapshot', () => {
    const tree = renderer.create(<fadeInLeft hasError={true} />).toJSON();
    expect(tree).toMatchSnapshot('error');
  });

  // Тестирование данных в компоненте
  test('should match data state snapshot', () => {
    const tree = renderer.create(<fadeInLeft data={<div>Data</div>} />).toJSON();
    expect(tree).toMatchSnapshot('data');
  });

  // Дополнительные сценарии тестирования
  test('should match specific scenario snapshot', () => {
    const tree = renderer.create(
      <fadeInLeft propA="valueA" propB="valueB" />
    ).toJSON();
    expect(tree).toMatchSnapshot('specificScenario');
  });
});
В приведенном выше примере кода представлены основные принципы создания snapshot-тестов для компонента `fadeInLeft`. Вы можете адаптировать этот шаблон под конкретные нужды вашего компонента, добавив дополнительные тесты для разных сценариев использования, состояний или пропсов.

// ============================================
// INTEGRATION TESTS
// Файл: fadeInLeft.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для fadeInLeft
// ============================================
Ниже приведён пример кода интеграционного теста компонента `fadeInLeft` с использованием библиотеки `@testing-library/react`, а также инструментов `MSW` для мокирования сетевых запросов и `@emotion/react` для работы с анимациями.

Допустим, у нас есть простой компонент, который использует анимацию `fadeInLeft`, и мы хотим проверить его работу в контексте интеграции.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux'; // Предположим, что используется Redux
import { createStore } from 'redux';
import { ThemeProvider } from '@emotion/react';
import theme from './theme'; // Импортируем тему из вашего проекта
import FadeInLeft from './FadeInLeft'; // Импортируем ваш компонент

// Создаём сервер для мокирования сетевых запросов
const server = setupServer(
  // Моки сетевых запросов здесь...
  rest.get('/api/data', (req, res, ctx) =>
    res(ctx.json({ data: ['item1', 'item2'] }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Создаём простую redux store
const initialState = {};
const store = createStore((state = initialState, action) => state);

describe('fadeInLeft Integration Tests', () => {
  it('should render with correct animation', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <FadeInLeft />
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/item1/i)).not.toBeNull()); // Ожидаем появления первого элемента
    await waitFor(() => expect(screen.queryByText(/item2/i)).not.toBeNull()); // Ожидаем появления второго элемента

    // Проверяем, что элементы появились с правильной анимацией
    expect(screen.getByText(/item1/i).closest('.animated')).toHaveClass('fadeInLeft');
    expect(screen.getByText(/item2/i).closest('.animated')).toHaveClass('fadeInLeft');
  });

  it('should handle loading state correctly', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <FadeInLeft isLoading={true} />
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeNull()); // Ожидаем появления текста "loading"

    // Проверяем, что элемент отображается с правильной анимацией при загрузке
    expect(screen.getByText(/loading/i).closest('.animated')).toHaveClass('fadeInLeft');
  });

  it('should handle error state correctly', async () => {
    server.use(
      rest.get('/api/error', (req, res, ctx) =>
        res(ctx.status(404), ctx.json({ message: 'Not Found' }))
      )
    );

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <FadeInLeft url="/api/error" />
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/error/i)).not.toBeNull()); // Ожидаем появления текста "error"

    // Проверяем, что элемент отображается с правильной анимацией при ошибке
    expect(screen.getByText(/error/i).closest('.animated')).toHaveClass('fadeInLeft');
  });
});
В этом примере:

- Используется библиотека `MSW` для создания мок-сервера (`setupServer`) и моков сетевых запросов.
- Компонент рендерится внутри контекста Redux через `Provider`.
- Проверяется корректное появление элементов с анимацией `fadeInLeft`.
- Проверяются различные состояния компонента — успешная загрузка данных, состояние загрузки и ошибка.

Этот подход позволяет покрыть основные требования к интеграционным тестам и убедиться, что компоненты работают правильно как в отдельности, так и в контексте всей системы.
