/**
 * Snapshot-тесты для проверки рендеринга для MainLayout
 * 
 * @file MainLayout.snapshot.test.tsx
 * @description Тестирование MainLayout 
 * @generated 2026-09-08T13:30:27.565Z
 * @type {snapshot}
 * @testCount 5
 * 
 * @dependencies @testing-library/react, react-test-renderer
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D react-test-renderer

import renderer from 'react-test-renderer';
import { MainLayout } from './MainLayout'; // Убедитесь, что импортируете корректный путь к вашему компоненту

describe('MainLayout Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<MainLayout />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Children', () => {
    const childComponent = <div>Test Child</div>;

    test('should match snapshot with children prop', () => {
      const tree = renderer.create(
        <MainLayout>
          {childComponent}
        </MainLayout>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match loading state snapshot', () => {
      const tree = renderer.create(
        <MainLayout isLoading={true} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    test('should match error state snapshot', () => {
      const tree = renderer.create(
        <MainLayout hasError={true} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Data State', () => {
    test('should match data state snapshot', () => {
      const tree = renderer.create(
        <MainLayout hasData={true} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
Этот набор тестов охватывает базовые сценарии и проверяет различные состояния компонента `MainLayout`, включая стандартные, с детьми (`children`), а также состояния загрузки, ошибки и наличия данных.