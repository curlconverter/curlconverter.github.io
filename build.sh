#!/bin/bash
./node_modules/browserify/bin/cmd.js scripts/main.js | ./node_modules/uglify-es/bin/uglifyjs -o scripts/main.min.js

