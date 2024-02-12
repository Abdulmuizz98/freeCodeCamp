import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import tailwindcssNesting from "tailwindcss/nesting";
import postcssImport from "postcss-import";
import postcssEach from "postcss-each";
import postcssMixins from "postcss-mixins";
import postcssPresetEnv from "postcss-preset-env";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcssNesting,
        tailwindcss,
        autoprefixer,
        postcssEach,
        postcssImport,
        postcssMixins,
        postcssPresetEnv,
      ],
    },
  },
});
