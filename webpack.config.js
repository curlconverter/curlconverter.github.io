import path from 'path'
import { fileURLToPath } from 'url'
import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import hljs from 'highlight.js'

import * as curlconverter from 'curlconverter'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const STARTING_CODE = `import requests

response = requests.get('http://example.com')`

const languages = {
  ansible: { converter: curlconverter.toAnsibleWarn, hljs: 'yaml' },
  // TODO: not supported by highlight.js
  cfml: { converter: curlconverter.toCFMLWarn, hljs: 'javascript' },
  dart: { converter: curlconverter.toDartWarn, hljs: 'dart' },
  elixir: { converter: curlconverter.toElixirWarn, hljs: 'elixir' },
  go: { converter: curlconverter.toGoWarn, hljs: 'go' },
  java: { converter: curlconverter.toJavaWarn, hljs: 'java' },
  javascript: { converter: curlconverter.toJavaScriptWarn, hljs: 'javascript' },
  json: { converter: curlconverter.toJsonStringWarn, hljs: 'json' },
  matlab: { converter: curlconverter.toMATLABWarn, hljs: 'matlab' },
  'node-fetch': { converter: curlconverter.toNodeWarn, hljs: 'javascript' },
  'node-axios': { converter: curlconverter.toNodeAxiosWarn, hljs: 'javascript' },
  'node-request': { converter: curlconverter.toNodeRequestWarn, hljs: 'javascript' },
  php: { converter: curlconverter.toPhpWarn, hljs: 'php' },
  python: { converter: curlconverter.toPythonWarn, hljs: 'python' },
  r: { converter: curlconverter.toRWarn, hljs: 'r' },
  ruby: { converter: curlconverter.toRubyWarn, hljs: 'ruby' },
  rust: { converter: curlconverter.toRustWarn, hljs: 'rust' },
  strest: { converter: curlconverter.toStrestWarn, hljs: 'yaml' }
}

const toLanguage = (language, converter, hljsLang) => {
  return (content) => {
    const newContent = content
      .toString()
      .replace(
        STARTING_CODE,
        hljs.highlight(converter(['curl', 'example.com'])[0], { language: hljsLang }).value
      )
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

const copyIndexHtml = () => {
  return Object.entries(languages).map((l) => {
    const [language, { converter, hljs }] = l
    return {
      from: 'index.html',
      to: language,
      transform: toLanguage(language, converter, hljs),
    };
  });
};

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
        { from: 'index.html', transform: (c) => c.toString().replace(STARTING_CODE, hljs.highlight(STARTING_CODE, {language: 'python'}).value) },
        { from: 'images', to: 'images' },
        'meta',
        'CNAME'
      ].concat(copyIndexHtml())
    })
  ],
  // Don't warn that we have a big JS bundle.
  performance: { hints: false }
}
