import UnoCSS from 'unocss/vite';
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), UnoCSS(), tsconfigPaths()],
  assetsInclude: ["./posts/*.md"]
});