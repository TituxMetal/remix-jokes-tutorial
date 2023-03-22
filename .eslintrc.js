/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["@remix-run/eslint-config", "@remix-run/eslint-config/node"],
  "rules": {
    "import/order": [
      "error",
      {
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        },
        "groups": [["builtin", "external"], "internal", "parent", "sibling"],
        "newlines-between": "always",
        "pathGroups": [
          {
            "pattern": "~/**",
            "group": "parent"
          }
        ]
      }
    ]
  }
};
