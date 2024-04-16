/* eslint-disable */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  moduleFileExtensions: ["js", "ts", "html"],
  globalSetup: "<rootDir>/jest-setup.js",
  globalTeardown: "<rootDir>/jest-cleanup.js",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testPathIgnorePatterns: ["<rootDir>/examples/"],
  collectCoverage: true,
  coverageReporters: ["json", "html", "text-summary"],
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: -10,
  //   },
  // },

  // transform: {
  //   "^.+\\.html?$": "jest-html-loader",
  // },
  // "moduleDirectories": [
  //     "src",
  //     "node_modules",
  //     ]
};
