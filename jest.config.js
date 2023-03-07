const config = {
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/android",
    "/ios"
  ],
}

module.exports = config