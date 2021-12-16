import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/azext.ts', '!src/tests/**'],
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts)$',
  coveragePathIgnorePatterns: ['<rootDir>/node_modules'],
  coverageReporters: ['text', 'cobertura'],
  reporters: [
    'default',
    ['jest-junit', { suiteName: 'AzExt Tests', outputName: 'test-results.xml' }]
  ]
};
export default config;
