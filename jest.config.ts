import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/azext.ts'],
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts)$',
  coveragePathIgnorePatterns: ['<rootDir>/node_modules']
};
export default config;
