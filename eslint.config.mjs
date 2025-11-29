// 你的 ESLint 配置文件
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier"; // 导入 prettier 规则集
import pluginPrettier from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  // 集成 Prettier 规则：先禁用冲突规则，再启用 Prettier 插件
  prettier,
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      "prettier/prettier": "error", // 将 Prettier 错误作为 ESLint 错误抛出
    },
  },
]);

export default eslintConfig;
