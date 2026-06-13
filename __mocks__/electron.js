module.exports = {
  app: {
    getPath: jest.fn(() => '/mock/path'),
  },
  ipcMain: {
    on: jest.fn(),
    handle: jest.fn(),
  },
  ipcRenderer: {
    send: jest.fn(),
    invoke: jest.fn(),
    on: jest.fn(() => ({ remove: jest.fn() })),
  },
};
