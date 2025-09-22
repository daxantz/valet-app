/* eslint-disable @typescript-eslint/no-var-requires */
const { createDefaultPreset } = require('ts-jest/presets')

const tsJestTransformCfg = createDefaultPreset().transform

/** @type {import("jest").Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  testMatch: ['**/__tests__/**/*.test.ts'], // look for tests in __tests__
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // optional setup (Prisma, DB, etc.)
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true, // auto-clear mocks between tests
}

module.exports = config
