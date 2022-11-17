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
  ansible: { converter: curlconverter.toAnsibleWarn, hljs: 'yaml', title: 'Ansible' },
  // TODO: CFML isn't supported by highlight.js
  cfml: { converter: curlconverter.toCFMLWarn, hljs: 'javascript', title: 'ColdFusion Markup Language' },
  csharp: { converter: curlconverter.toCSharpWarn, hljs: 'csharp', title: 'C#' },
  dart: { converter: curlconverter.toDartWarn, hljs: 'dart', title: 'Dart' },
  elixir: { converter: curlconverter.toElixirWarn, hljs: 'elixir', title: 'Elixir' },
  go: { converter: curlconverter.toGoWarn, hljs: 'go', title: 'Go' },
  java: { converter: curlconverter.toJavaWarn, hljs: 'java', title: 'Java' },
  javascript: { converter: curlconverter.toJavaScriptWarn, hljs: 'javascript', title: 'JavaScript' },
  // People googling for "curl json" are probably looking for something else
  json: { converter: curlconverter.toJsonStringWarn, hljs: 'json', title: 'a JSON object' },
  matlab: { converter: curlconverter.toMATLABWarn, hljs: 'matlab', title: 'MATLAB' },
  'node-fetch': { converter: curlconverter.toNodeWarn, hljs: 'javascript', title: 'node-fetch' },
  'node-axios': { converter: curlconverter.toNodeAxiosWarn, hljs: 'javascript', title: 'Node (Axios)' },
  'node-request': { converter: curlconverter.toNodeRequestWarn, hljs: 'javascript', title: 'Node (request)' },
  php: { converter: curlconverter.toPhpWarn, hljs: 'php', title: 'PHP' },
  python: { converter: curlconverter.toPythonWarn, hljs: 'python', title: 'Python' },
  r: { converter: curlconverter.toRWarn, hljs: 'r', title: 'R' },
  ruby: { converter: curlconverter.toRubyWarn, hljs: 'ruby', title: 'Ruby' },
  rust: { converter: curlconverter.toRustWarn, hljs: 'rust', title: 'Rust' },
}

const toLanguage = (language, title, converter, hljsLang) => {
  return (content) => {
    const newContent = content
      .toString()
      .replace(
        STARTING_CODE,
        hljs.highlight(converter(['curl', 'example.com'])[0], { language: hljsLang }).value
      )
      .replace('<option value="python" selected>Python</option>', '<option value="python">Python</option>')
      .replace(`<option value="${language}">`, `<option value="${language}" selected>`)
      .replace('<a class="nav-link active" href="/python/">Python</a>', '<a class="nav-link" href="/python/">Python</a>')
      .replace('<title>Convert curl commands to code</title>', `<title>Convert curl commands to ${title}</title>`)

    if (['node-fetch', 'node-axios', 'node-request'].includes(language)) {
      return newContent.replace('<a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Node.js</a>', '<a class="nav-link dropdown-toggle active" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Node.js</a>')
    } else {
      return newContent.replace(`<a class="nav-link" href="/${language}/"`, `<a class="nav-link active" href="/${language}/"`)
    }
  }
}

const copyIndexHtml = () => {
  return Object.entries(languages).map((l) => {
    const [language, { title, converter, hljs }] = l
    return {
      from: 'index.html',
      to: language,
      transform: toLanguage(language, title, converter, hljs),
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
        enforce: 'pre',
        use: ['source-map-loader']
      },
      {
        test: /\.sh$/,
        type: 'asset/source'
      },
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer'
                ]
              }
            }
          },
          'sass-loader'
        ]
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
        { from: 'index.html', transform: (c) => c.toString().replace(STARTING_CODE, hljs.highlight(STARTING_CODE, { language: 'python' }).value) },
        { from: 'images', to: 'images' },
        'meta',
        'CNAME'
      ].concat(copyIndexHtml())
    })
  ],
  // Don't warn that we have a big JS bundle.
  performance: { hints: false }
}
