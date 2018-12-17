module.exports = (wallaby) => {
  return {
    files: [
      'src/**/*.js',
      'config.js',
      'scripts/jest.setup.js',
      '!src/**/__tests__/*.js'
    ],

    tests: ['src/**/__tests__/*.js'],

    env: {
      type: 'node',
      runner: 'node',

      params: {
        env: 'NODE_ENV=test;NODE_PATH=' + wallaby.projectCacheDir // or whatever the folder is
      }
    },

    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel({
        babel: require("@babel/core")
      })
    },

    testFramework: 'jest'
  }
}
