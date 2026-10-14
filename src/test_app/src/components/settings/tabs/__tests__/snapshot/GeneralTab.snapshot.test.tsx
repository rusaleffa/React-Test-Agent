/**
 * Snapshot-тесты для проверки рендеринга для GeneralTab
 * 
 * @file GeneralTab.snapshot.test.tsx
 * @description Тестирование GeneralTab 
 * @generated 2026-09-08T13:22:50.654Z
 * @type {snapshot}
 * @testCount 5
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