import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    // Define global variables for browser, Node, and Jest environments
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Jest globals for unit tests
        jest: true,
        describe: true,
        test: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true
      }
    }
  },
  // Use recommended rules from the @eslint/js plugin
  pluginJs.configs.recommended
];