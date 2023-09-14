import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default {
  // ...other Vite configuration options...
  esbuild: {
    // Enable ES module interoperability
    jsxFactory: 'React.createElement',
    jsxInject: "import React from 'react'",
  },
};
