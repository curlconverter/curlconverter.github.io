A static Web app for showing off [curlconverter](https://github.com/curlconverter/curlconverter)

curlconverter uses [tree-sitter](https://tree-sitter.github.io/tree-sitter/) for Bash parsing, which adds some complexity to deployment because we have to copy the generated WASM files from `node_modules/` to serve them. See [webpack.config.js](webpack.config.js) for details.

# Running locally

    npm install
    npm start
