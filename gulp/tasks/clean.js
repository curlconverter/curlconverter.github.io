'use strict'

var gulp = require('gulp')
var del = require('del')

// Clean
gulp.task('clean', function () {
  return del(['.tmp', 'dist/styles', 'dist/scripts', 'dist/images'])
})
