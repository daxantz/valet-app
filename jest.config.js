import { createDefaultPreset } from 'ts-jest'

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

export default config
