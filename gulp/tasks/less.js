'use strict'

var config = require('../config')
var gulp = require('gulp')
var csso = require('gulp-csso')
var fingerprint = require('gulp-fingerprint')
var less = require('gulp-less')
var size = require('gulp-size')

// Styles
gulp.task('styles', function () {
  return gulp.src('app/less/app.less')
    .pipe(less({
      style: 'expanded',
      loadPath: [config.bower]
    }))
    .pipe(gulp.dest(config.dist + '/styles'))
    .pipe(size())
})

// Styles Dist
gulp.task('styles:dist', ['images:dist'], function () {
  var manifest = require('../../dist/image-manifest.json')
  return gulp.src('app/less/app.less')
    .pipe(less({
      style: 'expanded',
      loadPath: [config.bower]
    }))
    .pipe(fingerprint(manifest, {verbose: true}))
    .pipe(csso())  // minify css
    .pipe(gulp.dest(config.dist + '/styles'))
    .pipe(size())
})
