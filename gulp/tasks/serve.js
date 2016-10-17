'use strict';

var config = require('../config');
var gulp = require('gulp');
var serveStatic = require('serve-static')
var serveIndex = require('serve-index')

// Connect
gulp.task('connect', function () {
  var connect = require('connect');
  var app = connect()
    .use(require('connect-livereload')({ port: config.livereloadPort }))
    .use('/', serveStatic('.tmp'))
    .use('/', serveStatic('app'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(config.port)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:' + config.port);
    });
});

gulp.task('serve', ['connect', 'styles'], function () {
  require('opn')('http://localhost:' + config.port);
});
