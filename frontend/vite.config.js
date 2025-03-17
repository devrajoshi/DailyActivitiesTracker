import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Import PostCSS plugins dynamically
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});
