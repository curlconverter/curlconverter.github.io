#!/bin/bash
./node_modules/browserify/bin/cmd.js scripts/main.js | ./node_modules/uglify-js/bin/uglifyjs -o scripts/main.min.js

