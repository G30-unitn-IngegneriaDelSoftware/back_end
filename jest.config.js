module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Adjust this based on your project's setup
    },
    moduleDirectories: ['node_modules', 'src'],
    testPathIgnorePatterns: [
      "/node_modules/",
      "/dist/"
    ],
};