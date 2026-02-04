module.exports = {
  root: true,
  extends: ['@electron-toolkit/eslint-config/vue'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  }
}
