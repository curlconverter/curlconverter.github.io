import path from 'path'
import { fileURLToPath } from 'url'
import CopyPlugin from 'copy-webpack-plugin'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  entry: './index.js',
  mode: 'production',
  // mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    fallback: {
      url: require.resolve('url/'),
      path: require.resolve('path-browserify'),
      fs: false
    }
  },
  experiments: {
    topLevelAwait: true
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        'node_modules/web-tree-sitter/tree-sitter.wasm',
        'node_modules/curlconverter/tree-sitter-bash.wasm',
        'index.html',
        { from: 'images', to: 'images' },
        'meta'
      ]
    })
  ],
  // Don't warn that we have a big JS bundle.
  performance: { hints: false }
}
