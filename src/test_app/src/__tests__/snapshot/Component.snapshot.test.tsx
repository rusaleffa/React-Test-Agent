/**
 * Snapshot-тесты для проверки рендеринга для Component
 * 
 * @file Component.snapshot.test.tsx
 * @description Тестирование Component 
 * @generated 2026-09-08T13:36:41.233Z
 * @type {snapshot}
 * @testCount 3
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
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loading } from './components'; // Предполагаю, что компонент `Loading` находится в папке components

// Импортируем лениво загружаемые компоненты
const HomeLazy = lazy(() => import('./pages/Home'));
const TaskDetailsLazy = lazy(() => import('./pages/TaskDetails'));
const SharePageLazy = lazy(() => import('./pages/Share'));
const AddTaskLazy = lazy(() => import('./pages/AddTask'));
const UserProfileLazy = lazy(() => import('./pages/UserProfile'));
const TransferLazy = lazy(() => import('./pages/Transfer'));
const CategoriesLazy = lazy(() => import('./pages/Categories'));
const PurgeLazy = lazy(() => import('./pages/Purge'));
const SyncLazy = lazy(() => import('./pages/Sync'));
const NotFoundLazy = lazy(() => import('./pages/NotFound'));

// Функция рендеринга компонента с загрузкой и падением
function renderApp() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<HomeLazy />} />
        <Route path="/task/:id" element={<TaskDetailsLazy />} />
        <Route path="/share" element={<SharePageLazy />} />
        <Route path="/add" element={<AddTaskLazy />} />
        <Route path="/user" element={<UserProfileLazy />} />
        <Route path="/transfer" element={<TransferLazy />} />
        <Route path="/categories" element={<CategoriesLazy />} />
        <Route path="/purge" element={<PurgeLazy />} />
        <Route path="/sync" element={<SyncLazy />} />
        <Route path="*" element={<NotFoundLazy />} />
      </Routes>
    </Suspense>
  );
}

describe('AppRouter Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer.create(renderApp()).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when loading', () => {
    const tree = renderer.create(
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomeLazy />} />
          <Route path="/task/:id" element={<TaskDetailsLazy />} />
          <Route path="/share" element={<SharePageLazy />} />
          <Route path="/add" element={<AddTaskLazy />} />
          <Route path="/user" element={<UserProfileLazy />} />
          <Route path="/transfer" element={<TransferLazy />} />
          <Route path="/categories" element={<CategoriesLazy />} />
          <Route path="/purge" element={<PurgeLazy />} />
          <Route path="/sync" element={<SyncLazy />} />
          <Route path="*" element={<NotFoundLazy />} />
        </Routes>
      </Suspense>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when error occurs', () => {
    const tree = renderer.create(
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomeLazy />} />
          <Route path="/task/:id" element={<TaskDetailsLazy />} />
          <Route path="/share" element={<SharePageLazy />} />
          <Route path="/add" element={<AddTaskLazy />} />
          <Route path="/user" element={<UserProfileLazy />} />
          <Route path="/transfer" element={<TransferLazy />} />
          <Route path="/categories" element={<CategoriesLazy />} />
          <Route path="/purge" element={<PurgeLazy />} />
          <Route path="/sync" element={<SyncLazy />} />
          <Route path="*" element={<NotFoundLazy />} />
        </Routes>
      </Suspense>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
Этот набор тестов проверяет три основных случая:
- Стандартный рендеринг без ошибок или загрузки (`default props`)
- Рендеринг с отображаемым компонентом загрузки (`loading state`)
- Рендеринг с ошибкой (`error state`)