module.exports = function(env, { mode }) {
  const path = require('path');
  const production = mode === 'production';
  return {
    mode: production ? 'production' : 'development',
    entry: 'startup.ts',
    devtool: production ? 'source-map' : 'eval-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['src', 'node_modules'].map(src => path.join(__dirname, src)),
    },
    devServer: {
      stats: {
        warnings: false
      }
    },
    module: {
      rules: [
        { test: /\.ts$/i, loader: 'ts-loader' },
        { test: /\.html$/i, loader: 'html-loader' }
      ]
    }
  }
}
