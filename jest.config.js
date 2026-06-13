/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/renderer/src/$1',
    '^@ipc/(.*)$': '<rootDir>/src/ipc/$1',
    '^@workers/(.*)$': '<rootDir>/src/main/workers/$1',
    '^@ui/(.*)$': '<rootDir>/src/renderer/src/components/ui/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^electron$': '<rootDir>/__mocks__/electron.js',
    '^.*\\.worker$': '<rootDir>/__mocks__/worker.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironmentOptions: {
    "IS_REACT_ACT_ENVIRONMENT": true
  }
};