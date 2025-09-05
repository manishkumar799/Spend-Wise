import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["56b277b90_logo.png", "apple-touch-icon.png"],
      manifest: {
        name: "Expense Tracker",
        short_name: "Expense Tracker",
        description:
          "An expense tracking application to help you manage your finances effectively.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "56b277b90_logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "56b277b90_logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@features": path.resolve(__dirname, "./src/features"),
    },
  },
});
