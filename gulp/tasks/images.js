'use strict'

var config = require('../config')
var path = require('path')
var gulp = require('gulp')
var changed = require('gulp-changed')
var imagemin = require('gulp-imagemin')
var rename = require('gulp-rename')
var rev = require('gulp-rev')
var size = require('gulp-size')

// Images
gulp.task('images', function () {
  var dest = config.dist + '/images'

  return gulp.src('app/images/**/*')
    .pipe(changed(dest)) // Ignore unchanged files
    .pipe(imagemin()) // Optimize
    .pipe(gulp.dest(dest))
})

// Images Dist
gulp.task('images:dist', ['images'], function () {
  return gulp.src(['app/images/**/*'], {base: path.resolve('app')})
    .pipe(imagemin()) // Optimize
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(size())
    .pipe(rev.manifest())
    .pipe(rename('image-manifest.json'))
    .pipe(gulp.dest('dist'))
})
