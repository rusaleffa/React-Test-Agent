/**
 * Snapshot-тесты для проверки рендеринга для CustomEmojiPicker
 * 
 * @file CustomEmojiPicker.snapshot.test.tsx
 * @description Тестирование CustomEmojiPicker 
 * @generated 2026-09-07T22:45:11.495Z
 * @type {snapshot}
 * @testCount 16
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
import { CustomEmojiPicker } from './CustomEmojiPicker';

describe('CustomEmojiPicker Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<CustomEmojiPicker />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Emoji Prop', () => {
    test('should match snapshot with provided emoji', () => {
      const tree = renderer.create(<CustomEmojiPicker emoji="😊" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Color Prop', () => {
    test('should match snapshot with provided color', () => {
      const tree = renderer.create(<CustomEmojiPicker color="#ff0000" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Type Task', () => {
    test('should match snapshot with type task', () => {
      const tree = renderer.create(<CustomEmojiPicker type="task" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Type Category', () => {
    test('should match snapshot with type category', () => {
      const tree = renderer.create(<CustomEmojiPicker type="category" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Show Emoji Picker', () => {
    test('should match snapshot with show emoji picker', () => {
      const tree = renderer.create(<CustomEmojiPicker showEmojiPicker={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Current Emoji', () => {
    test('should match snapshot with current emoji', () => {
      const tree = renderer.create(<CustomEmojiPicker currentEmoji="🚀" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Loading State', () => {
    test('should match snapshot with loading state', () => {
      const tree = renderer.create(<CustomEmojiPicker isLoading={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Error State', () => {
    test('should match snapshot with error state', () => {
      const tree = renderer.create(<CustomEmojiPicker hasError={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With No Emoji Selected', () => {
    test('should match snapshot with no emoji selected', () => {
      const tree = renderer.create(<CustomEmojiPicker currentEmoji={null} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With AI Feature Enabled', () => {
    test('should match snapshot with ai feature enabled', () => {
      const tree = renderer.create(<CustomEmojiPicker useAI={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With AI Feature Disabled', () => {
    test('should match snapshot with ai feature disabled', () => {
      const tree = renderer.create(<CustomEmojiPicker useAI={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Online Status Offline', () => {
    test('should match snapshot with online status offline', () => {
      const tree = renderer.create(<CustomEmojiPicker isOnline={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Online Status Online', () => {
    test('should match snapshot with online status online', () => {
      const tree = renderer.create(<CustomEmojiPicker isOnline={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Simple Emoji Picker On', () => {
    test('should match snapshot with simple emoji picker on', () => {
      const tree = renderer.create(<CustomEmojiPicker settings={{ simpleEmojiPicker: true }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Simple Emoji Picker Off', () => {
    test('should match snapshot with simple emoji picker off', () => {
      const tree = renderer.create(<CustomEmojiPicker settings={{ simpleEmojiPicker: false }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});