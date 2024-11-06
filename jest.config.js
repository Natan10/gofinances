const config = {
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "jest-styled-components",
    "./src/setupTest.ts"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/android",
    "/ios"
  ],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.tsx", "!src/**/*.spec.tsx"],
  coverageReporters: [
    "lcov"
  ]
}

module.exports = config