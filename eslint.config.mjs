import nextPlugin from '@next/eslint-plugin-next'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import { fileURLToPath } from 'url'
import path from 'path'

// Helper function to convert ESM paths
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolveStyleGuide = (relativePath) => 
  path.resolve(__dirname, `./node_modules/@vercel/style-guide/eslint/${relativePath}.js`)

export default [
  {
    ignores: ['**/*', '!app/**/*']  // Ignore everything except app directory
  },
  {
    plugins: {
      '@next/next': nextPlugin,
      'jsx-a11y': jsxA11y,
    },
    extends: [
      resolveStyleGuide('browser'),
      resolveStyleGuide('react'),
      resolveStyleGuide('next'),
      'prettier',
    ],
    rules: {
      // jsx-a11y recommended rules
      ...jsxA11y.configs.recommended.rules,
      // Any custom rules can go here
    }
  }
]