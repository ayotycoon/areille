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

  // transform: {
  //   "^.+\\.html?$": "jest-html-loader",
  // },
  // "moduleDirectories": [
  //     "src",
  //     "node_modules",
  //     ]
};
