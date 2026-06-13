import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n-test-config';
import GamingView from '../GamingView';
import { IpcChannel } from '@ipc/index';
import { KeyMapping } from '@shared/types/keymapping';

jest.mock('@ui/button', () => ({
  Button: ({ children, onClick, variant }: {children: React.ReactNode, onClick: React.MouseEventHandler<HTMLButtonElement>, variant?: string}) => (
    <button onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
}));

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: jest.Mock;
        invoke: jest.Mock;
        on: jest.Mock;
      };
    };
  }
}

window.electron = {
  ipcRenderer: {
    send: jest.fn(),
    invoke: jest.fn(),
    on: jest.fn(() => ({ remove: jest.fn() })),
  },
};

describe('GamingView', () => {
  const deviceId = 'test-device';
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();

    window.electron.ipcRenderer.invoke.mockImplementation(
      async (channel: IpcChannel, ...args) => {
        if (channel === IpcChannel.LOAD_KEYMAP_PROFILE) {
          if (args[0] === 'Default') {
            return [];
          }
          if (args[0] === 'existing-profile') {
            return [{ key: 'w', x: 100, y: 100, type: 'tap' }] as KeyMapping[];
          }
        }
        if (channel === IpcChannel.SAVE_KEYMAP_PROFILE) {
          return true;
        }
        return Promise.resolve(null);
      },
    );
  });

  const renderComponent = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <GamingView deviceId={deviceId} onClose={onClose} />
      </I18nextProvider>,
    );

  it('renders correctly and loads the default profile on mount', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Gaming Mode - test-device/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(window.electron.ipcRenderer.invoke).toHaveBeenCalledWith(
        IpcChannel.LOAD_KEYMAP_PROFILE,
        'Default',
      );
    });
    await waitFor(() => {
      expect(window.electron.ipcRenderer.invoke).toHaveBeenCalledWith(
        IpcChannel.START_KEYMAPPER,
        { deviceId, mappings: [] },
      );
    });
    expect(screen.getByRole('textbox')).toHaveValue('Default');
  });

  it('allows a user to save a new keymap profile', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('Default'));

    const profileInput = screen.getByRole('textbox');
    fireEvent.change(profileInput, { target: { value: 'my-new-profile' } });

    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(window.electron.ipcRenderer.invoke).toHaveBeenCalledWith(
        IpcChannel.SAVE_KEYMAP_PROFILE,
        { name: 'my-new-profile', mappings: [] },
      );
    });
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Profile saved successfully!'));
  });

  it('allows a user to load an existing keymap profile', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('Default'));

    const profileInput = screen.getByRole('textbox');
    fireEvent.change(profileInput, { target: { value: 'existing-profile' } });

    const loadButton = screen.getByText(/Load/i);
    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(window.electron.ipcRenderer.invoke).toHaveBeenCalledWith(
        IpcChannel.LOAD_KEYMAP_PROFILE,
        'existing-profile',
      );
    });

    expect(await screen.findByText('W')).toBeInTheDocument();
    expect(await screen.findByText('(100, 100) - tap')).toBeInTheDocument();

    await waitFor(() => {
      expect(window.electron.ipcRenderer.invoke).toHaveBeenCalledWith(
        IpcChannel.START_KEYMAPPER,
        { deviceId, mappings: [{ key: 'w', x: 100, y: 100, type: 'tap' }] },
      );
    });
  });

  it('calls the onClose prop when the close button is clicked', () => {
    renderComponent();
    const closeButton = screen.getByText(/Close/i);
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
