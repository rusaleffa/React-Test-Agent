/**
 * Модульные тесты для изолированной проверки компонента для CustomEmojiPicker
 * 
 * @file CustomEmojiPicker.unit.test.tsx
 * @description Тестирование CustomEmojiPicker 
 * @generated 2026-09-07T22:45:11.493Z
 * @type {unit}
 * @testCount 9
 * 
 * @dependencies @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D @testing-library/jest-dom
// npm install -D @testing-library/user-event

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CustomEmojiPicker from './CustomEmojiPicker';

describe('CustomEmojiPicker', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<CustomEmojiPicker />);
      expect(screen.getByRole('button')).toBeInTheDocument(); // Проверяем кнопку редактирования
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); // Убедимся, что диалог не отображается сразу
    });

    it('should render with custom emoji', () => {
      render(<CustomEmojiPicker emoji="😊" setEmoji={() => {}} color="#ff0000" name="Task" type="task" />);
      expect(screen.getByText(/😊/)).toBeInTheDocument(); // Проверим рендер выбранного эмодзи
    });

    it('should render simple picker container when settings are configured', () => {
      render(<CustomEmojiPicker settings={{ simpleEmojiPicker: true }} />);
      expect(screen.getByTestId('simple-picker-container')).toBeInTheDocument();
    });

    it('should render dialog when settings are not configured', () => {
      render(<CustomEmojiPicker settings={{ simpleEmojiPicker: false }} />);
      expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should toggle emoji picker on click', () => {
      render(<CustomEmojiPicker />);
      const editButton = screen.getByRole('button');
      userEvent.click(editButton);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should select emoji from picker', async () => {
      render(<CustomEmojiPicker setEmoji={() => {}} />);
      const editButton = screen.getByRole('button');
      userEvent.click(editButton);
      const emojiPicker = screen.getByRole('dialog');
      const emojiOption = screen.getByText(/🤖/); // Пример выбора конкретного эмодзи
      userEvent.click(emojiOption);
      expect(screen.getByText(/🤖/)).toBeInTheDocument();
    });

    it('should remove emoji on remove button click', async () => {
      render(<CustomEmojiPicker setEmoji={() => {}} currentEmoji="😊" />);
      const editButton = screen.getByRole('button');
      userEvent.click(editButton);
      const removeButton = screen.getByText(/Remove Emoji/);
      userEvent.click(removeButton);
      expect(screen.queryByText(/😊/)).not.toBeInTheDocument();
    });

    it('should call AI function when button is clicked', async () => {
      jest.spyOn(CustomEmojiPicker.prototype, 'useAI').mockImplementation(async () => {});
      render(<CustomEmojiPicker name="test" type="task" />);
      const aiButton = screen.getByText(/Find emoji with AI/);
      userEvent.click(aiButton);
      await waitFor(() => expect(CustomEmojiPicker.prototype.useAI).toHaveBeenCalledWith());
    });
  });
});

describe('Helper Functions', () => {
  it('should convert emoji to unified format', () => {
    const result = CustomEmojiPicker.emojiToUnified(':)');
    expect(result).toEqual('263a');
  });
});