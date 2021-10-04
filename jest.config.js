module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest/setEnvVars.ts'],
  moduleNameMapper: {
    '@exmpl/(.*)': '<rootDir>/src/$1',
  },
};
