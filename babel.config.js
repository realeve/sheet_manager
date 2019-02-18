module.exports = {
  // babel 7.0
  // presets: ['@babel/preset-env', '@babel/preset-react'],
  // plugins: ['@babel/plugin-proposal-export-default-from'],
  // presets: ['env', 'react'],
  presets: ['@babel/preset-react', '@babel/preset-env', '@babel/preset-typescript'], // this is equivalent
  plugins: ['@babel/plugin-transform-runtime', '@babel/transform-arrow-functions'], // same
};
