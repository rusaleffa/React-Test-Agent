/**
 * Snapshot-тесты для проверки рендеринга для SharePage
 * 
 * @file SharePage.snapshot.test.tsx
 * @description Тестирование SharePage 
 * @generated 2026-09-08T13:33:50.534Z
 * @type {snapshot}
 * @testCount 8
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
import SharePage from './SharePage';

describe('SharePage Snapshot Tests', () => {
  describe('Default Props and States', () => {
    test('should match snapshot with default props and loading state', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with error state', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage error={true} errorDetails={'Test error details'} />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with valid task data', () => {
      const taskData = {
        name: 'Test Task',
        description: 'Test Description',
        color: '#FF0000',
        category: [{ id: 'test-cat-id', color: '#00FF00' }],
      };
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage taskData={taskData} />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('User Name Prop Variations', () => {
    test('should match snapshot with short user name prop', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage userNameParam='short-name' />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with long user name prop', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage userNameParam='a'.repeat(USER_NAME_MAX_LENGTH + 1) />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Task Data Prop Variations', () => {
    test('should match snapshot with empty task data', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage taskParam='' />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with invalid task data', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage taskParam='invalid-data' />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with valid task data', () => {
      const taskData = {
        name: 'Valid Task',
        description: 'Valid Description',
        color: '#FF0000',
        category: [{ id: 'valid-cat-id', color: '#00FF00' }],
      };
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage taskParam=LZString.compressToEncodedURIComponent(JSON.stringify(taskData)) />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});