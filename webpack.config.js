import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import CopyPlugin from 'copy-webpack-plugin'

const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  entry: './scripts/main.js',
  mode: 'production',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
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
        { from: 'styles', to: 'styles' },
        'meta'
      ]
    })
  ]
}
