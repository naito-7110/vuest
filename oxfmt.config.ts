import { defineConfig } from 'oxfmt'

export default defineConfig({
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  insertFinalNewline: true,

  vueIndentScriptAndStyle: false,
  singleAttributePerLine: false,
  htmlWhitespaceSensitivity: 'css',
})
