import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'recharts',
      'html2canvas',
      '@tanstack/react-query',
      '@mui/x-charts',
      '@chakra-ui/react',
      'react-window',
      'axios',
      'react-icons/fa',
      'react-simple-maps',
      'framer-motion',
      'react-error-boundary',
      'd3-geo',
      'd3-color',
      'd3-delaunay',
      'd3-interpolate',
      'd3-path',
      'd3-shape',
      'd3-time',
      'd3-timer',
      'geojson'
    ],
    exclude: [],
  },
  server: {
    fs: {
      strict: false, 
    },
  },
});