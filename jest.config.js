export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/test', '<rootDir>/lambda/tests'],
  moduleFileExtensions: ['ts', 'mjs', 'js'],
  testMatch: [
    "**/__tests__/**/*.?(m)[jt]s?(x)",
    "**/?(*.)+(spec|test).?(m)[tj]s?(x)"
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    'jest': {
      useESM: true
    }
  }
};
