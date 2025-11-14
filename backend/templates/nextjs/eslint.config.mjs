import next from "eslint-config-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    ignores: ["next.config.mjs", "next-env.d.ts"],
  },
  ...next,
];

export default config;
