import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
// For GitHub Pages, set the base to your repository name
// For example, if your repo is 'spin-the-wheel', the base should be '/spin-the-wheel/'
// For user/organization pages, use '/'
// You can override this by setting VITE_BASE_PATH environment variable
const base = process.env.VITE_BASE_PATH || '/spin-the-wheel/';

export default defineConfig({
  plugins: [react()],
  base: base,
  server: {
    host: 'localhost'
  }
});
