import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GeneralTab from '../GeneralTab';
import CustomSwitch from '../CustomSwitch'; // импортируем дочерний компонент


describe('GeneralTab', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<GeneralTab />);

      expect(screen.getByText(/enable categories/i)).toBeInTheDocument();
      expect(screen.getByText(/enable categories/i).closest('label')).toHaveAttribute('for', 'enableCategories');
      expect(screen.getByText(/enable categories/i).nextElementSibling).toMatchInlineSnapshot(`<CustomSwitch>`);  

      expect(screen.getByText(/app badge/i)).toBeInTheDocument();
      expect(screen.getByText(/app badge/i).closest('label')).toHaveAttribute('for', 'appBadge');
      expect(screen.getByText(/app badge/i).nextElementSibling).toMatchInlineSnapshot(`<CustomSwitch>`);

      expect(screen.getByText(/completed tasks at bottom/i)).toBeInTheDocument();
      expect(screen.getByText(/completed tasks at bottom/i).closest('label')).toHaveAttribute('for', 'doneToBottom');
      expect(screen.getByText(/completed tasks at bottom/i).nextElementSibling).toMatchInlineSnapshot(`<CustomSwitch>`);

      expect(screen.getByText(/show progress bar/i)).toBeInTheDocument();
      expect(screen.getByText(/show progress bar/i).closest('label')).toHaveAttribute('for', 'showProgressBar');
      expect(screen.getByText(/show progress bar/i).nextElementSibling).toMatchInlineSnapshot(`<CustomSwitch>`);
    });

    it('should render with disabled prop for App Badge', () => {
      const isPWA = false;
      const setAppBadge = undefined; // имитируем отсутствие поддержки браузера
      render(
        <GeneralTab
          systemInfo={{ isPWA }}
          navigator={{ setAppBadge }}
        />
      );

      expect(screen.queryByText(/app badge/i)).not.toBeInTheDocument(); // элемент не должен рендериться
    });
  });

  describe('Взаимодействие с элементами', () => {
    let mockSetAppBadge;

    beforeEach(() => {
      mockSetAppBadge = jest.fn();
      render(
        <GeneralTab
          systemInfo={{ isPWA: true }}
          navigator={{ setAppBadge: mockSetAppBadge }}
        />
      );
    });

    it('should toggle enableCategories switch', async () => {
      await userEvent.click(screen.getByLabelText(/enable categories/i));

      expect(mockSetAppBadge).not.toHaveBeenCalled(); // нет необходимости в вызове внешнего API
    });

    it('should toggle showProgressBar switch', async () => {
      await userEvent.click(screen.getByLabelText(/show progress bar/i));

      expect(mockSetAppBadge).not.toHaveBeenCalled(); // нет необходимости в вызове внешнего API
    });

    it('should toggle appBadge switch', async () => {
      await userEvent.click(screen.getByLabelText(/app badge/i));

      expect(mockSetAppBadge).toHaveBeenCalled(); // внешний API должен быть вызван при изменении состояния
    });

    it('should toggle doneToBottom switch', async () => {
      await userEvent.click(screen.getByLabelText(/completed tasks at bottom/i));

      expect(mockSetAppBadge).not.toHaveBeenCalled(); // нет необходимости в вызове внешнего API
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: GeneralTab.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для GeneralTab
// ============================================
import renderer from 'react-test-renderer';
import { systemInfo } from '../../../utils';
import CustomSwitch from '../CustomSwitch';

// Имитация системы и браузера с поддержкой PWA
jest.mock('../../../utils');
systemInfo.isPWA = true;
navigator.setProperty('setAppBadge', true);

describe('GeneralTab Snapshot Tests', () => {
  // Базовый случай без пропсов
  test('should match snapshot with default props', () => {
    const tree = renderer.create(<GeneralTab />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай, когда пропс `enableCategories` установлен в false
  test('should match snapshot when enableCategories is false', () => {
    const tree = renderer.create(
      <GeneralTab>
        <CustomSwitch
          settingKey="enableCategories"
          header="Enable Categories"
          text="Enable categories to organize your tasks."
          checked={false}
        />
      </GeneralTab>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай, когда пропс `appBadge` отключен из-за отсутствия поддержки браузером
  test('should match snapshot when appBadge is disabled due to lack of support', () => {
    const tree = renderer.create(
      <GeneralTab>
        <CustomSwitch
          settingKey="appBadge"
          header="App Badge"
          text="Show a badge on the PWA icon to indicate the number of not done tasks."
          disabled={true}
          disabledReason="This feature requires the app to be installed as a PWA and supported by your browser."
        />
      </GeneralTab>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай, когда пропс `doneToBottom` включен
  test('should match snapshot when doneToBottom is enabled', () => {
    const tree = renderer.create(
      <GeneralTab>
        <CustomSwitch
          settingKey="doneToBottom"
          header="Completed Tasks at Bottom"
          text="Move completed tasks to the bottom of the list to keep your active tasks more visible."
          checked={true}
        />
      </GeneralTab>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Случай, когда пропс `showProgressBar` отключен
  test('should match snapshot when showProgressBar is disabled', () => {
    const tree = renderer.create(
      <GeneralTab>
        <CustomSwitch
          settingKey="showProgressBar"
          header="Show Progress Bar"
          text="Display a progress bar at the top of the screen to visualize your task completion."
          checked={false}
        />
      </GeneralTab>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
