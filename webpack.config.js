module.exports = function(env, { mode }) {
  const path = require('path');
  const production = mode === 'production';
  function resolveAurelia(package) {
    return path.resolve(__dirname, 'node_modules', '@aurelia', package, 'dist', 'esnext');
  }
  const aurelia = path.resolve(__dirname, 'node_modules', '@aurelia');
  return {
    mode: production ? 'production' : 'development',
    entry: 'startup.ts',
    devtool: production ? 'source-map' : 'eval-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['src', 'node_modules'].map(src => path.join(__dirname, src)),
      alias: {
        '@aurelia/kernel': resolveAurelia('kernel'),
        '@aurelia/plugin-svg': resolveAurelia('plugin-svg'),
        '@aurelia/runtime': resolveAurelia('runtime'),
        '@aurelia/jit': resolveAurelia('jit'),
        '@aurelia/debug': resolveAurelia('debug')
      }
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
