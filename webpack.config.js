import path from 'path'
import { fileURLToPath } from 'url'
import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  entry: './index.js',
  mode: 'production',
  devtool: 'source-map',
  // mode: 'development',
  // devtool: 'eval-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.sh$/,
        type: 'asset/source'
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
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        'node_modules/web-tree-sitter/tree-sitter.wasm',
        'node_modules/curlconverter/dist/tree-sitter-bash.wasm',
        'node_modules/bootstrap/dist/css/bootstrap.min.css.map',
        'index.html',
        { from: 'index.html', to: 'ansible' },
        { from: 'index.html', to: 'cfml' },
        { from: 'index.html', to: 'dart' },
        { from: 'index.html', to: 'elixir' },
        { from: 'index.html', to: 'go' },
        { from: 'index.html', to: 'java' },
        { from: 'index.html', to: 'javascript' },
        { from: 'index.html', to: 'json' },
        { from: 'index.html', to: 'node-fetch' },
        { from: 'index.html', to: 'node-axios' },
        { from: 'index.html', to: 'node-request' },
        { from: 'index.html', to: 'matlab' },
        { from: 'index.html', to: 'php' },
        { from: 'index.html', to: 'python' },
        { from: 'index.html', to: 'r' },
        { from: 'index.html', to: 'rust' },
        { from: 'index.html', to: 'strest' },
        { from: 'images', to: 'images' },
        'meta',
        'CNAME'
      ]
    })
  ],
  // Don't warn that we have a big JS bundle.
  performance: { hints: false }
}
