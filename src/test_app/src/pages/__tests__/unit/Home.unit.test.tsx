/**
 * Модульные тесты для изолированной проверки компонента для Home
 * 
 * @file Home.unit.test.tsx
 * @description Тестирование Home 
 * @generated 2026-09-08T13:32:37.410Z
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
import Home from '../Home';
import { UserContext } from '../contexts/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';
import TasksList from '../components/tasks/TasksList';
import AnimatedGreeting from '../components/AnimatedGreeting';
import Offline from '../components/offline/Offline';
import ProgressPercentageContainer from '../styles/ProgressPercentageContainer';
import StyledProgress from '../styles/StyledProgress';
import TaskCountClose from '../styles/TaskCountClose';
import TaskCountHeader from '../styles/TaskCountHeader';
import TaskCountTextContainer from '../styles/TaskCountTextContainer';
import TasksCount from '../styles/TasksCount';
import TasksCountContainer from '../styles/TasksCountContainer';
import AddButton from '../components/buttons/AddButton';
import GreetingHeader from '../components/greeting/GreetingHeader';
import { Emoji } from 'emoji-picker-react';
import { Box, Button, CircularProgress, Tooltip, Typography } from '@mui/material';
import { AddRounded, CloseRounded, TodayRounded, UndoRounded, WifiOff } from '@mui/icons-material';

const mockUser = {
  user: {
    tasks: [],
    emojisStyle: {},
    settings: {
      showProgressBar: true,
      enableGlow: true,
    },
    name: '',
  },
  setUser: jest.fn(),
};

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={mockUser}>{children}</UserContext.Provider>
);

describe('Home', () => {
  describe('Рендеринг', () => {
    it('should render without errors', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );
      expect(screen.queryByTestId('root')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.getByRole('heading', { name: /good/i })).toBeInTheDocument();
      expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-label', 'Add Task');
      expect(screen.getByText(/you have/i)).toBeInTheDocument();
      expect(screen.getByText(/progress/i)).toBeInTheDocument();
      expect(screen.getByText(/add new task/i)).toBeInTheDocument();
    });

    it('should render offline message', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.getByRole('alert')).toHaveTextContent('You're offline but you can use the app!');
    });

    it('should render animated greeting', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render tasks list', async () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      await waitFor(() => expect(screen.getByRole('listitem')).toBeInTheDocument());
    });

    it('should render add button for mobile devices', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.queryByRole('button', { name: /add new task/i })).not.toBeInTheDocument();
    });

    it('should render add button for non-mobile devices', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    it('should handle click event on add button', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      userEvent.click(screen.getByRole('button', { name: /add task/i }));
      expect(mockUser.setUser).toHaveBeenCalledTimes(1);
    });

    it('should handle click event on close progress bar', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      userEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(mockUser.setUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('Проверки пропсов', () => {
    it('should pass props to child components', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.getByRole('heading').closest('.MuiTypography-root')).toHaveStyle({
        fontFamily: 'Roboto',
      });
      expect(screen.getByRole('link').closest('.MuiButton-root')).toHaveStyle({
        backgroundColor: '#ffc107',
      });
    });
  });

  describe('Моки внешних API', () => {
    it('should mock online status', () => {
      const mockIsOnline = jest.fn().mockReturnValue(false);
      global.navigator.onLine = false;

      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(mockIsOnline).toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent('You're offline but you can use the app!');
    });
  });
});

// Дополнительные моки для дочерних компонентов можно добавить здесь, если потребуется