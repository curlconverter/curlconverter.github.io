import path from 'path'
import { fileURLToPath } from 'url'
import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import webpack from 'webpack'

import hljs from 'highlight.js'

import { languages } from './languages.js'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const STARTING_CODE = `import requests

response = requests.get('http://example.com')`

const toLanguage = (language, title, converter, hljsLang) => {
  return (content) => {
    const newContent = content
      .toString()
      .replace(
        STARTING_CODE,
        hljs.highlight(converter(['curl', 'example.com'])[0], { language: hljsLang }).value
      )
      .replace('<option value="python" selected>Python + Requests</option>', '<option value="python">Python + Requests</option>')
      .replace(`<option value="${language}">`, `<option value="${language}" selected>`)

      .replace('<a class="nav-link dropdown-toggle active" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Python</a>', '<a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Python</a>')
      .replace('<li><a class="dropdown-item active" href="/python/">Requests</a></li>', '<li><a class="dropdown-item" href="/python/">Requests</a></li>')
      .replace(`<li><a class="dropdown-item" href="/${language}/">`, `<li><a class="dropdown-item active" href="/${language}/">`)

      .replace('<title>Convert curl commands to code</title>', `<title>Convert curl commands to ${title}</title>`)

    if (['java', 'java-asynchttp', 'java-okhttp'].includes(language)) {
      return newContent.replace('<a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Java</a>', '<a class="nav-link dropdown-toggle active" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Java</a>')
    } else if (['javascript', 'javascript-jquery', 'javascript-xhr'].includes(language)) {
      return newContent.replace('<a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">JavaScript</a>', '<a class="nav-link dropdown-toggle active" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">JavaScript</a>')
    } else if (['node-fetch', 'node-axios', 'node-got', 'node-request', 'node-http'].includes(language)) {
      return newContent.replace('<a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Node.js</a>', '<a class="nav-link dropdown-toggle active" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Node.js</a>')
    } else if (['powershell-restmethod', 'powershell-webrequest'].includes(language)) {
      return newContent.replace('<a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">PowerShell</a>', '<a class="nav-link dropdown-toggle active" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">PowerShell</a>')
    } else if (['python', 'python-httpclient'].includes(language)) {
      return newContent.replace('<a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Python</a>', '<a class="nav-link dropdown-toggle active" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Python</a>')
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
        use: [
          {
            loader: 'source-map-loader',
            options: {
              filterSourceMappingUrl: (url, resourcePath) => {
                if (/get-own-enumerable-property-symbols/i.test(resourcePath)) {
                  return false;
                }

                return true;
              },
            },
          },
        ]
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
      path: require.resolve('path-browserify'),
      fs: false,
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "url": require.resolve("url/"),
      "querystring": require.resolve("querystring-es3"),
      "string_decoder": require.resolve("string_decoder/"),
      "buffer": require.resolve("buffer/")
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
        { from: 'index.html', transform: (c) => c.toString().replace(STARTING_CODE, hljs.highlight(STARTING_CODE, { language: 'python' }).value) },
        { from: 'images', to: 'images' },
        'meta',
        'CNAME'
      ].concat(copyIndexHtml())
    }),
    new webpack.ProvidePlugin({
      process: "process/browser"
    })
  ],
  // Don't warn that we have a big JS bundle.
  performance: { hints: false }
}
