module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom']
};