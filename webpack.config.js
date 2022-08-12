import path from 'path'
import { fileURLToPath } from 'url'
import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import * as curlconverter from 'curlconverter'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const STARTING_CODE = `import requests

response = requests.get('http://example.com')`

const toLanguage = (language, converter) => {
  return (content) => {
    const newContent = content
    .toString()
    .replace(STARTING_CODE, converter(['curl', 'example.com']).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'))
    .replace('<option value="python" selected>Python</option>', '<option value="python">Python</option>')
    .replace(`<option value="${language}">`, `<option value="${language}" selected>`)
    .replace('<a class="nav-link active" href="/python">Python</a>', '<a class="nav-link" href="/python">Python</a>')
    if (['node-fetch', 'node-axios', 'node-request'].includes(language)) {
      return newContent.replace('<a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Node.js</a>', '<a class="nav-link dropdown-toggle active" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Node.js</a>')
    } else {
      return newContent.replace(`<a class="nav-link" href="/${language}"`, `<a class="nav-link active" href="/${language}"`)
    }
  }
}

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
        { from: 'index.html', to: 'ansible', transform: toLanguage( 'ansible', curlconverter.toAnsible) },
        { from: 'index.html', to: 'cfml', transform: toLanguage('cfml', curlconverter.toCFML) },
        { from: 'index.html', to: 'dart', transform: toLanguage('dart', curlconverter.toDart) },
        { from: 'index.html', to: 'elixir', transform: toLanguage('elixir', curlconverter.toElixir) },
        { from: 'index.html', to: 'go', transform: toLanguage('go', curlconverter.toGo) },
        { from: 'index.html', to: 'java', transform: toLanguage('java', curlconverter.toJava) },
        { from: 'index.html', to: 'javascript', transform: toLanguage('javascript', curlconverter.toJavaScript) },
        { from: 'index.html', to: 'json', transform: toLanguage('json', curlconverter.toJsonString) },
        { from: 'index.html', to: 'node-fetch', transform: toLanguage('node-fetch', curlconverter.toNodeFetch) },
        { from: 'index.html', to: 'node-axios', transform: toLanguage('node-axios', curlconverter.toNodeAxios) },
        { from: 'index.html', to: 'node-request', transform: toLanguage('node-request', curlconverter.toNodeRequest) },
        { from: 'index.html', to: 'matlab', transform: toLanguage('matlab', curlconverter.toMATLAB) },
        { from: 'index.html', to: 'php', transform: toLanguage('php', curlconverter.toPhp) },
        { from: 'index.html', to: 'python', transform: toLanguage('python', curlconverter.toPython) },
        { from: 'index.html', to: 'r', transform: toLanguage('r', curlconverter.toR) },
        { from: 'index.html', to: 'rust', transform: toLanguage('rust', curlconverter.toRust) },
        { from: 'index.html', to: 'strest', transform: toLanguage('strest', curlconverter.toStrest) },
        { from: 'images', to: 'images' },
        'meta',
        'CNAME'
      ]
    })
  ],
  // Don't warn that we have a big JS bundle.
  performance: { hints: false }
}
