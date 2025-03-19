import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  {
    ignores: ['**/*', '!app/**/*']  // Ignore everything except app directory
  },
  ...compat.config({
    extends: ['next', 'prettier'],
  }),
]

export default eslintConfig