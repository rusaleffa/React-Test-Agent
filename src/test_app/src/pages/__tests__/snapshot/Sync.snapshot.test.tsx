/**
 * Snapshot-тесты для проверки рендеринга для Sync
 * 
 * @file Sync.snapshot.test.tsx
 * @description Тестирование Sync 
 * @generated 2026-09-08T13:34:31.488Z
 * @type {snapshot}
 * @testCount 6
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
import { MockUserContext } from '../__mocks__/MockUserContext';
import { MockUseOnlineStatus } from '../__mocks__/MockUseOnlineStatus';
import { MockUsePeerSync } from '../__mocks__/MockUsePeerSync';
import { MockUseResponsiveDisplay } from '../__mocks__/MockUseResponsiveDisplay';

// Импортируйте необходимые компоненты и функции из контекста и хуков
// ...

describe('Sync Snapshot Tests', () => {
  // Тест начального экрана с кнопками отображения и сканирования QR-кода
  test('should match initial screen snapshot', () => {
    const tree = renderer
      .create(
        <MockUserContext>
          <MockUseOnlineStatus>
            <MockUseResponsiveDisplay>
              <MockUsePeerSync>
                <Sync />
              </MockUsePeerSync>
            </MockUseResponsiveDisplay>
          </MockUseOnlineStatus>
        </MockUserContext>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест режима отображения QR-кода
  test('should match display QR code mode snapshot', () => {
    const tree = renderer
      .create(
        <MockUserContext>
          <MockUseOnlineStatus>
            <MockUseResponsiveDisplay>
              <MockUsePeerSync>
                <Sync />
              </MockUsePeerSync>
            </MockUseResponsiveDisplay>
          </MockUseOnlineStatus>
        </MockUserContext>,
        {
          mode: 'display',
          hostPeerId: 'test-host-id',
          syncStatus: {
            message: 'Idle',
            severity: 'success'
          },
          otherDataSyncOption: 'this_device',
          otherDataSource: 'this_device'
        }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест режима сканирования QR-кода
  test('should match scan QR code mode snapshot', () => {
    const tree = renderer
      .create(
        <MockUserContext>
          <MockUseOnlineStatus>
            <MockUseResponsiveDisplay>
              <MockUsePeerSync>
                <Sync />
              </MockUsePeerSync>
            </MockUseResponsiveDisplay>
          </MockUseOnlineStatus>
        </MockUserContext>,
        {
          mode: 'scan',
          syncStatus: {
            message: 'Connecting to host...',
            severity: 'info'
          }
        }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест успешного завершения синхронизации данных
  test('should match successful synchronization snapshot', () => {
    const tree = renderer
      .create(
        <MockUserContext>
          <MockUseOnlineStatus>
            <MockUseResponsiveDisplay>
              <MockUsePeerSync>
                <Sync />
              </MockUsePeerSync>
            </MockUseResponsiveDisplay>
          </MockUseOnlineStatus>
        </MockUserContext>,
        {
          mode: 'display',
          hostPeerId: 'test-host-id',
          syncStatus: {
            message: 'Sync complete',
            severity: 'success'
          },
          otherDataSyncOption: 'this_device',
          otherDataSource: 'this_device'
        }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест ошибки в процессе синхронизации
  test('should match error during synchronization snapshot', () => {
    const tree = renderer
      .create(
        <MockUserContext>
          <MockUseOnlineStatus>
            <MockUseResponsiveDisplay>
              <MockUsePeerSync>
                <Sync />
              </MockUsePeerSync>
            </MockUseResponsiveDisplay>
          </MockUseOnlineStatus>
        </MockUserContext>,
        {
          mode: 'display',
          syncStatus: {
            message: 'An error occurred while syncing',
            severity: 'error'
          }
        }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест предупреждения о проблеме синхронизации
  test('should match warning during synchronization snapshot', () => {
    const tree = renderer
      .create(
        <MockUserContext>
          <MockUseOnlineStatus>
            <MockUseResponsiveDisplay>
              <MockUsePeerSync>
                <Sync />
              </MockUsePeerSync>
            </MockUseResponsiveDisplay>
          </MockUseOnlineStatus>
        </MockUserContext>,
        {
          mode: 'display',
          syncStatus: {
            message: 'Warning: some issues found',
            severity: 'warning'
          }
        }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});