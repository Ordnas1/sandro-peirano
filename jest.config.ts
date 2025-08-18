/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['./setup-jest.ts'],
  collectCoverageFrom: [
    "src/app/**/*.ts",
    "!src/app/main.ts",
    "!src/app/app.config.ts",
    "!src/app/app.routes.ts",
  ]
}

export default config;
