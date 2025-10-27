import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Mircea: tell vite that when we import parse, it should import the minified version
  resolve: {
    alias: {
      parse: "parse/dist/parse.min.js",
    },
  },

  // Mircea: load parse faster during development time
  optimizeDeps: {
    include: ["parse"],
  },
});
