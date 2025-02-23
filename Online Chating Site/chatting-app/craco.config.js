const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@backend': path.resolve(__dirname, 'Backend'),
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  }
};
