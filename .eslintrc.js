module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    camelcase: 'off',
    quotes: [2, 'single', {
      // 允许字符串使用单引号或者双引号，只要字符串中包含了一个其他引号，否则需要转义
      avoidEscape: true,
      // 允许字符串使用反勾号
      allowTemplateLiterals: true
    }]
  }
}
