// jest.config.cjs
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    // Para que Jest entienda "@/..." como en tu código de Next
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};