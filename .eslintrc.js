const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    JSX: true,
  },
  reportUnusedDisableDirectives: true,
  extends: [
    "eslint:recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:@docusaurus/all",
  ],
  plugins: ["react-hooks", "@typescript-eslint", "@docusaurus"],
  rules: {
    "@typescript-eslint/no-explicit-any": OFF,
    "@typescript-eslint/no-non-null-assertion": OFF,
    "@typescript-eslint/no-unused-vars": [ERROR, { ignoreRestSiblings: true }],
    "import/prefer-default-export": OFF,
    "no-param-reassign": OFF,
    "no-new": OFF,
    "no-restricted-syntax": OFF,
    "no-shadow": OFF,
    "no-template-curly-in-string": WARNING,
    "no-unused-expressions": [WARNING, { allowTaggedTemplates: true }],
    "no-useless-escape": WARNING,
    "no-void": [ERROR, { allowAsStatement: true }],
    "prefer-destructuring": WARNING,
    "prefer-named-capture-group": WARNING,
    "lines-between-class-members": OFF,
    "react/jsx-filename-extension": OFF,
    "react/jsx-props-no-spreading": OFF,
    "react/destructuring-assignment": OFF,
    "react/require-default-props": [
      ERROR,
      { ignoreFunctionalComponents: true },
    ],
    "react/function-component-definition": [
      WARNING,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "import/extensions": OFF,
    "import/no-unresolved": [
      OFF,
      {
        ignore: [
          "^@theme",
          "^@docusaurus",
          "^@generated",
          "^@site",
          "^@testing-utils",
        ],
      },
    ],
    "import/no-extraneous-dependencies": [
      WARNING,
      { devDependencies: ["**/*.test.ts", "**/*.test.tsx"] },
    ],
  },
  overrides: [
    {
      files: ["website/**"],
      rules: {
        "@typescript-eslint/no-var-requires": OFF,
      },
    },
    // TODO: Find a way to use translations in this plugin
    {
      files: ["packages/docusaurus-plugin-ga-feedback/**"],
      rules: {
        "@docusaurus/no-untranslated-text": OFF,
      },
    },
  ],
};
