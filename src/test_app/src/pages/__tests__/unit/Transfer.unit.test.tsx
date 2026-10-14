/**
 * Модульные тесты для изолированной проверки компонента для Transfer
 * 
 * @file Transfer.unit.test.tsx
 * @description Тестирование Transfer 
 * @generated 2026-09-08T13:35:49.927Z
 * @type {unit}
 * @testCount 11
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
import { MemoryRouter } from 'react-router-dom';
import Transfer from './Transfer';
import { UserContext } from '../../contexts/UserContext';
import { createMemoryContext } from '../../__mocks__/createMemoryContext';

const mockUser = {
  createdAt: new Date(),
  tasks: [
    {
      id: 'task1',
      name: 'Test Task',
      description: 'This is a test task',
      category: {
        id: 'cat1',
        name: 'Test Category'
      },
      emojisStyle: {},
      color: '#FF0000'
    }
  ],
  categories: []
};

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={createMemoryContext(mockUser)}>
    {children}
  </UserContext.Provider>
);

describe('Transfer', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <Transfer />
          </MockUserContext>
        </MemoryRouter>
      );
      expect(screen.getByText(/transfer/i)).toBeInTheDocument();
    });

    it('displays no tasks message when there are no tasks', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <Transfer />
          </MockUserContext>
        </MemoryRouter>
      );
      expect(screen.queryByText(/you don't have any tasks to export/i)).toBeInTheDocument();
    });

    it('displays tasks when they exist', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <Transfer />
          </MockUserContext>
        </MemoryRouter>
      );
      expect(screen.getByText(/test task/i)).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = render(
        <MemoryRouter>
          <MockUserContext>
            <Transfer />
          </MockUserContext>
        </MemoryRouter>
      );
    });

    it('handles task selection', async () => {
      const task = screen.getByText(/test task/i);
      userEvent.click(task);
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeChecked();
      });
    });

    it('exports selected tasks', async () => {
      const task = screen.getByText(/test task/i);
      userEvent.click(task);
      const exportButton = screen.getByText(/export selected to json/i);
      userEvent.click(exportButton);
      await waitFor(() => {
        expect(screen.getByText(/exported tasks/i)).toBeInTheDocument();
      });
    });

    it('exports all tasks', async () => {
      const exportAllButton = screen.getByText(/export all tasks to json/i);
      userEvent.click(exportAllButton);
      await waitFor(() => {
        expect(screen.getByText(/exported all tasks/i)).toBeInTheDocument();
      });
    });

    it('imports tasks via drag-and-drop', async () => {
      const dropzone = screen.getByRole('region');
      userEvent.dragAndDrop(dropzone, { file: new File(['{}'], 'test.json') });
      await waitFor(() => {
        expect(screen.getByText(/tasks successfully imported/i)).toBeInTheDocument();
      });
    });

    it('imports tasks via file upload', async () => {
      const fileInput = screen.getByLabelText(/select json file/i);
      userEvent.upload(fileInput, new File(['{}'], 'test.json'));
      await waitFor(() => {
        expect(screen.getByText(/tasks successfully imported/i)).toBeInTheDocument();
      });
    });

    it('imports tasks via clipboard', async () => {
      const clipboardInput = screen.getByRole('button', { name: /import json from clipboard/i });
      userEvent.click(clipboardInput);
      await waitFor(() => {
        expect(screen.getByText(/tasks successfully imported/i)).toBeInTheDocument();
      });
    });

    it('imports tasks via QR code', async () => {
      const qrCodeInput = screen.getByRole('button', { name: /scan qr code/i });
      userEvent.click(qrCodeInput);
      userEvent.type(screen.getByRole('dialog'), '{enter}');
      await waitFor(() => {
        expect(screen.getByText(/qr code scanned successfully/i)).toBeInTheDocument();
      });
    });

    it('imports tasks via link', async () => {
      const linkInput = screen.getByRole('button', { name: /paste link/i });
      userEvent.click(linkInput);
      userEvent.paste(linkInput, { target: 'text', data: `${location.href}` });
      await waitFor(() => {
        expect(screen.getByText(/tasks successfully imported/i)).toBeInTheDocument();
      });
    });
  });
});