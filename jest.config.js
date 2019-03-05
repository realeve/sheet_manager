const { defaults } = require('jest-config');
module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  transform: { '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest' },
  testMatch: ['**/?(*.)(spec|test|e2e).(j|t)s?(x)'],
  testURL: 'http://localhost:8000',
  collectCoverage: true,
  // coverageReporters: ['text-lcov'],
  // moduleNameMapper: {
  //   '^umi-utils$': '<rootDir>/node_modules/umi-utils/lib',
  //   '^umi(.*)$': '<rootDir>/node_modules/umi/lib$1',
  // },
  globals: {
    'ts-jest': {
      useBabelrc: true,
    },
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
