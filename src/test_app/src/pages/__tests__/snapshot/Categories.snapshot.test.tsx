/**
 * Snapshot-тесты для проверки рендеринга для Categories
 * 
 * @file Categories.snapshot.test.tsx
 * @description Тестирование Categories 
 * @generated 2026-09-08T13:31:55.028Z
 * @type {snapshot}
 * @testCount 6
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
import { MemoryRouter } from 'react-router-dom';
import Categories from './Categories'; // Импортируйте ваш компонент здесь

// Пример создания снапшотов с различными сценариями и состояниями компонента

describe('Categories Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when adding a new category', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .root
      .findByType(CategoryInput)
      .props.onChange({ target: { value: 'New Category' } });
    expect(renderer.create(<Categories />).toJSON()).toMatchSnapshot();
  });

  test('should match snapshot when editing an existing category', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .root
      .findByType(EditNameInput)
      .props.onChange({ target: { value: 'Updated Name' } });
    expect(renderer.create(<Categories />).toJSON()).toMatchSnapshot();
  });

  test('should match snapshot when deleting a category', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .root
      .findByType(Dialog)
      .props.onClick(); // Имитация клика на кнопку удаления категории
    expect(renderer.create(<Categories />).toJSON()).toMatchSnapshot();
  });

  test('should match snapshot when showing associated tasks in delete dialog', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .root
      .findByType(AssociatedTasksAccordion); // Имитация отображения связанных задач в диалоге удаления
    expect(renderer.create(<Categories />).toJSON()).toMatchSnapshot();
  });

  test('should match snapshot when adding to favorites', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .root
      .findByType(CustomDialogTitle)
      .props.onClick(); // Имитация добавления категории в избранное
    expect(renderer.create(<Categories />).toJSON()).toMatchSnapshot();
  });

  // Добавьте дополнительные тесты для других состояний и сценариев работы вашего компонента
});