module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json"
  },
  plugins: ["@typescript-eslint", "react", "prettier"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "import/no-extraneous-dependencies": 0,
    "react/require-default-props": 0,
    "no-param-reassign": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "react/jsx-props-no-spreading": 0,
    "no-underscore-dangle": 0,
    "import/prefer-default-export": 0,
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "": "never",
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ]
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".vue", ".ts", ".d.ts"]
      },
      alias: {
        extensions: [".vue", ".js", ".ts", ".scss", ".d.ts"],
        map: [
          ["@/assets", "./src/assets"],
          ["@/components", "./src/components"],
          ["@/data", "./src/data"],
          ["@/firebase", "./src/firebase"],
          ["@/hooks", "./src/hooks"],
          ["@/icons", "./src/icons"],
          ["@/misc", "./src/misc"],
          ["@/pages", "./src/pages"],
          ["@/providers", "./src/providers"],
          ["@/store", "./src/store"],
          ["@/recoil", "./src/recoil"]
        ]
      }
    }
  }
};
