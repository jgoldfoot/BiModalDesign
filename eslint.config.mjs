import jest from "eslint-plugin-jest";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: [
    "**/node_modules/",
    "**/coverage/",
    "**/dist/",
    "**/build/",
    "**/*.min.js",
    "**/node_modules/",
    "**/coverage/",
    "**/dist/",
    "**/build/",
    "tools/agent-simulator.js",
    "tools/bimodal-design-cli.js",
    "accessibility/compliance-audit.js",
    "tools/validators/fr1-checker.js",
    "**/examples/",
    "**/*.config.js",
    "**/.eslintrc.js",
        ]
    },
    ...compat.extends("eslint:recommended", "prettier"),
    {

    plugins: {
        jest,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },

        ecmaVersion: 2021,
        sourceType: "module",
    },

    rules: {
        "no-console": "off",

        "no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
        }],

        "prefer-const": "warn",
        "no-var": "error",
        eqeqeq: ["error", "always"],
        curly: ["error", "all"],
        "no-eval": "error",
        "no-implied-eval": "error",
        "no-new-func": "error",
        "no-return-await": "warn",
        "require-await": "warn",
    },
}, {
    files: ["__tests__/**/*.js", "**/*.test.js", "**/*.spec.js"],

    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },

    rules: {
        "no-unused-expressions": "off",
    },
}];