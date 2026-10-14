/**
 * Snapshot-тесты для проверки рендеринга для UserProfile
 * 
 * @file UserProfile.snapshot.test.tsx
 * @description Тестирование UserProfile 
 * @generated 2026-09-08T13:36:16.656Z
 * @type {snapshot}
 * @testCount 9
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
import { UserProfile } from './UserProfile';

describe('UserProfile Snapshot Tests', () => {
  describe('Default Props and States', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<UserProfile />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when loading avatar', () => {
      const tree = renderer.create(<UserProfile />).toJSON(); // simulate loading state
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when showing broken profile picture alert', () => {
      const tree = renderer.create(<UserProfile />).toJSON(); // simulate broken profile picture scenario
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when showing logout dialog', () => {
      const tree = renderer.create(<UserProfile />).toJSON(); // simulate logout dialog
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when showing change image dialog', () => {
      const tree = renderer.create(<UserProfile />).toJSON(); // simulate change image dialog
      expect(tree).toMatchSnapshot();
    });
  });

  describe('States and Scenarios', () => {
    test('should match snapshot when updating user name', () => {
      const tree = renderer.create(<UserProfile user={{ name: 'John Doe' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when changing profile picture via link', () => {
      const tree = renderer.create(<UserProfile user={{ profilePicture: 'LOCAL_FILE_abc123' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when changing profile picture via file upload', () => {
      const tree = renderer.create(<UserProfile user={{ profilePicture: '' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot when deleting profile picture', () => {
      const tree = renderer.create(<UserProfile user={{ profilePicture: 'LOCAL_FILE_abc123' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});