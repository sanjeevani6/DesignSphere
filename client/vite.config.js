import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      
      },
   
    },
  },
  
 
  resolve: {
    alias: {
   //   "@": "/src", // Optional: for cleaner imports like @/components/MyComponent
    },
  },
});
