import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "172.20.10.10", // IP específico
    open: false, // Não abre automaticamente
  },
});
