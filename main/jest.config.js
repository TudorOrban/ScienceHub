module.exports = {
    transform: {
        '^.+\\.tsx?$': ['babel-jest', { configFile: './babel.config.jest.js' }],
    },     
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
};
  