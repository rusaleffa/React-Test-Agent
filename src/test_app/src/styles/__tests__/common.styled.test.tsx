import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DialogBtn from '../DialogBtn';

describe('DialogBtn', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<DialogBtn />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      render(<DialogBtn children="Custom Text" />);
      expect(screen.getByText(/custom text/i)).toBeInTheDocument();
    });

    it('should render with custom styles', () => {
      render(
        <DialogBtn style={{ backgroundColor: 'red' }}>
          Custom Style
        </DialogBtn>
      );
      expect(screen.getByRole('button').style.backgroundColor).toEqual('red');
    });
  });

  describe('Обработка событий', () => {
    it('should call onClick handler when clicked', () => {
      const mockOnClick = jest.fn();
      render(<DialogBtn onClick={mockOnClick}>Button</DialogBtn>);
      userEvent.click(screen.getByRole('button'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Вспомогательные стили и компоненты', () => {
    it('should apply correct styles to child components', () => {
      render(
        <DialogBtn>
          <PathName>Test Path</PathName>
        </DialogBtn>
      );
      expect(screen.getByRole('link')).toHaveStyleRule('background', '#000000c8');
      expect(screen.getByRole('link')).toHaveStyleRule('color', 'white');
    });

    it('should have correct styling for pulse label', () => {
      render(
        <DialogBtn>
          <PulseLabel />
        </DialogBtn>
      );
      expect(screen.getByRole('presentation')).toHaveStyleRule(
        'animation',
        'pulseAnimation(theme.primary, 8) 1.2s infinite'
      );
    });

    it('should handle visually hidden input correctly', () => {
      render(
        <DialogBtn>
          <VisuallyHiddenInput type="text" name="test" />
        </DialogBtn>
      );
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });
});

describe('UserAvatar', () => {
  it('should render avatar with image and no pulse', () => {
    render(
      <UserAvatar hasimage size="40px">
        <img alt="avatar" src="/path/to/image.jpg" />
      </UserAvatar>
    );
    expect(screen.getByAltText('avatar')).toBeInTheDocument();
  });

  it('should render avatar without image and with pulse', () => {
    render(
      <UserAvatar hasimage={false} size="40px" pulse>
        <div>No Image</div>
      </UserAvatar>
    );
    expect(screen.getByText('No Image')).toBeInTheDocument();
    expect(screen.getByRole('presentation')).toHaveStyleRule(
      'animation',
      'pulseAnimation(theme.darkmode ? "#5e5e65" : "#8c919c", 10) 1.2s infinite'
    );
  });
});

describe('ColorElement', () => {
  it('should render button with default colors', () => {
    render(
      <ColorElement>
        <span>Default Color</span>
      </ColorElement>
    );
    expect(screen.getByText('Default Color')).toHaveStyleRule(
      'background',
      'transparent'
    );
  });

  it('should render button with gradient colors', () => {
    render(
      <ColorElement clr="#ff0000" secondClr="#00ff00">
        <span>Gradient Colors</span>
      </ColorElement>
    );
    expect(screen.getByText('Gradient Colors')).toHaveStyleRule(
      'background',
      'linear-gradient(135deg, #ff0000 50%, #00ff00 50%)'
    );
  });

  it('should render button with hover effect', () => {
    const mockDisableHover = false;
    render(
      <ColorElement disableHover={mockDisableHover}>
        <span>Hover Effect</span>
      </ColorElement>
    );
    userEvent.hover(screen.getByText('Hover Effect'));
    expect(screen.getByText('Hover Effect')).toHaveStyleRule(
      'box-shadow',
      '0 0 12px #ff0000'
    );
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: DialogBtn.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для DialogBtn
// ============================================
import renderer from 'react-test-renderer';
import { DialogBtn } from './DialogBtn'; // Импортируйте компонент здесь

describe('DialogBtn Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<DialogBtn />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Custom Props', () => {
    const customProps = {
      variant: 'outlined',
      startIcon: <PathName>{'test'}</PathName>,
      endIcon: <VisuallyHiddenInput type="hidden" name="input" />,
      disabled: true,
      fullWidth: true,
      color: 'secondary',
      size: 'large'
    };

    test('should match snapshot with custom props', () => {
      const tree = renderer.create(<DialogBtn {...customProps} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    test('should match snapshot in error state', () => {
      const tree = renderer.create(
        <DialogBtn error>
          <PathName>{'error message'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match snapshot in loading state', () => {
      const tree = renderer.create(
        <DialogBtn loading>
          <PathName>{'loading...'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Disabled State', () => {
    test('should match snapshot in disabled state', () => {
      const tree = renderer.create(
        <DialogBtn disabled>
          <PathName>{'disabled'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Full Width', () => {
    test('should match snapshot when fullWidth is true', () => {
      const tree = renderer.create(
        <DialogBtn fullWidth>
          <PathName>{'full width'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Custom Size', () => {
    test('should match snapshot when size is large', () => {
      const tree = renderer.create(
        <DialogBtn size='large'>
          <PathName>{'large size'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Custom Colors', () => {
    test('should match snapshot with secondary color', () => {
      const tree = renderer.create(
        <DialogBtn color='secondary'>
          <PathName>{'secondary color'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with primary color', () => {
      const tree = renderer.create(
        <DialogBtn color='primary'>
          <PathName>{'primary color'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Start and End Icons', () => {
    test('should match snapshot with start and end icons', () => {
      const tree = renderer.create(
        <DialogBtn startIcon={<PathName>{'start icon'}</PathName>}
                   endIcon={<PathName>{'end icon'}</PathName>}>
          <PathName>{'with icons'}</PathName>
        </DialogBtn>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: DialogBtn.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для DialogBtn
// ============================================
Ниже приведён пример кода интеграционного теста компонента `DialogBtn`, который включает настройку MSW сервера, проверку API вызовов, обработку состояний загрузки и ошибок, а также взаимодействие с Redux-провайдером (в данном случае предполагается использование простого контекста).

Допустим, у нас есть простой компонент, использующий API `/users` для получения списка пользователей, и мы хотим проверить его работу в контексте.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux'; // или любой другой провайдер контекста
import store from './store'; // ваш Redux store
import DialogBtn from './components/DialogBtn';

const server = setupServer(
  // Моки API
  rest.get('/users', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ]));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('DialogBtn Integration Tests', () => {
  it('should load users list successfully', async () => {
    render(
      <Provider store={store}>
        <DialogBtn />
      </Provider>
    );

    expect(screen.queryByText(/loading/i)).toBeInTheDocument(); // проверка состояния загрузки

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should handle error fetching users', async () => {
    server.use(
      rest.get('/users', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Internal Server Error' }));
      })
    );

    render(
      <Provider store={store}>
        <DialogBtn />
      </Provider>
    );

    expect(screen.queryByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      expect(screen.getByText('Error: Internal Server Error')).toBeInTheDocument();
    });
  });

  it('should trigger action on click', async () => {
    render(
      <Provider store={store}>
        <DialogBtn />
      </Provider>
    );

    const btn = screen.getByRole('button');
    userEvent.click(btn);

    await waitFor(() => {
      expect(store.getState().dialogOpen).toEqual(true);
    });
  });
});
В этом примере:

- Настраивается сервер MSW для мокирования API.
- Проверяется успешная загрузка данных из API и отображение их на экране.
- Проверяется обработка ошибок при неудачной попытке получить данные.
- Проверяется срабатывание действия при нажатии кнопки.

Этот подход можно адаптировать под любые специфические требования вашего приложения, включая более сложные сценарии работы с состоянием и Redux.
