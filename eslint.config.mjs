import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        // Vitest globals for unit tests
        describe: true,
        test: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        // Node globals for config files, etc.
        require: true,
        module: true,
        process: true
      },
    },
  },
  pluginJs.configs.recommended,
];
