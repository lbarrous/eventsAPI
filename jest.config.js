module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest/setEnvVars.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  moduleNameMapper: {
    '@exmpl/(.*)': '<rootDir>/src/$1',
  },
};
