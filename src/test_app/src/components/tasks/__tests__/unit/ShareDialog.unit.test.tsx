/**
 * Модульные тесты для изолированной проверки компонента для ShareDialog
 * 
 * @file ShareDialog.unit.test.tsx
 * @description Тестирование ShareDialog 
 * @generated 2026-09-08T13:25:03.052Z
 * @type {unit}
 * @testCount 8
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
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ShareDialog from './ShareDialog';
import { UserContext } from '../../contexts/UserContext';
import { Task } from '../../types/user';
import { ToastStore } from 'react-hot-toast';

const mockUser = {
  user: {
    name: 'Test User',
    settings: {},
  },
};

const mockTask: Task = {
  id: 'test-task-id',
  name: 'Test Task Name',
  description: 'Test Description',
  deadline: new Date('2023-10-10T12:00:00'),
  category: 'Work',
};

jest.mock('react-hot-toast', () => ({
  useToasterStore: () => ({
    toasts: [],
  }),
}));

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={{ user: mockUser }}>
    {children}
  </UserContext.Provider>
);

describe('ShareDialog', () => {
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog open onClose={() => {}} selectedTask={mockTask} />
          </MockUserContext>
        </MemoryRouter>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Share Task')).toBeInTheDocument();
      expect(screen.getByText('Share your task with others.')).toBeInTheDocument();
      expect(screen.getByText(mockTask.name)).toBeInTheDocument();
    });

    it('renders with custom tab values', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={() => {}}
              selectedTask={mockTask}
              shareTabVal={1}
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      expect(screen.getAllByRole('tab')[1]).toHaveClass('Mui-selected');
    });

    it('renders download qr code button', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={() => {}}
              selectedTask={mockTask}
              shareTabVal={1}
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      expect(screen.getByText('Download QR Code')).toBeInTheDocument();
    });

    it('renders add to apple calendar button when appropriate', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={() => {}}
              selectedTask={mockTask}
              shareTabVal={2}
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      expect(screen.getByText('Add to Apple Calendar')).toBeInTheDocument();
    });
  });

  describe('Events', () => {
    it('copies link to clipboard', async () => {
      const mockOnClose = jest.fn();
      const mockGenerateShareableLink = jest.fn(() =>
        'http://example.com/share/task=test&user=Test+User',
      );

      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={mockOnClose}
              selectedTask={mockTask}
              shareTabVal={0}
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      const copyButton = screen.getByText('Copy');
      fireEvent.click(copyButton);

      await waitFor(() => expect(mockOnClose).not.toHaveBeenCalled());
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'http://example.com/share/task=test&user=Test+User',
      );
    });

    it('shares link using navigator.share', async () => {
      const mockOnClose = jest.fn();
      const mockGenerateShareableLink = jest.fn(() =>
        'http://example.com/share/task=test&user=Test+User',
      );

      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={mockOnClose}
              selectedTask={mockTask}
              shareTabVal={0
              }
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      const shareButton = screen.getByText('Share');
      fireEvent.click(shareButton);

      await waitFor(() => expect(mockOnClose).not.toHaveBeenCalled());
      expect(navigator.share).toHaveBeenCalledWith({
        title: 'Share Task',
        text: `Check out this task: Test Task Name`,
        url: 'http://example.com/share/task=test&user=Test+User',
      });
    });

    it('adds task to apple calendar', async () => {
      const mockOnClose = jest.fn();
      const mockGenerateShareableLink = jest.fn(() =>
        'http://example.com/share/task=test&user=Test+User',
      );

      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={mockOnClose}
              selectedTask={mockTask}
              shareTabVal={2
              }
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      const addToAppleCalendarButton = screen.getByText('Add to Apple Calendar');
      fireEvent.click(addToAppleCalendarButton);

      await waitFor(() => expect(mockOnClose).not.toHaveBeenCalled());
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('Interaction with child components', () => {
    it('passes correct props to TaskItem', () => {
      const mockOnClose = jest.fn();
      render(
        <MemoryRouter>
          <MockUserContext>
            <ShareDialog
              open
              onClose={mockOnClose}
              selectedTask={mockTask}
              shareTabVal={0
              }
            />
          </MockUserContext>
        </MemoryRouter>,
      );

      const taskItem = screen.getByRole('listitem');
      expect(taskItem).toHaveAttribute('features', '{"enableGlow":false}');
    });
  });
});