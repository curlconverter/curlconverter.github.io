'use strict';

var config = require('../config');
var gulp = require('gulp');
// var prefix = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var fingerprint = require('gulp-fingerprint');
var less = require('gulp-less');
var size = require('gulp-size');

// Styles
gulp.task('styles', function () {
  return gulp.src('app/less/app.less')
    // Leaving out recess support due to string interpolation missing in less v1.3 (which recess is dependent on)
    // .pipe(recess())
    .pipe(less({
      style: 'expanded',
      loadPath: [config.bower]
    }))
    .pipe(gulp.dest(config.dist + '/styles'))
    .pipe(size());
});


// Styles Dist
gulp.task('styles:dist', function () {
  var manifest = require('../../dist/image-manifest');
  return gulp.src('app/less/app.less')
    // Leaving out recess support due to string interpolation missing in less v1.3 (which recess is dependent on)
    // .pipe(recess())
    .pipe(less({
      style: 'expanded',
      loadPath: [config.bower]
    }))
    // .pipe(prefix('last 1 version'))  // add vendor prefixes if necessary
    .pipe(fingerprint(manifest, {verbose: true}))
    .pipe(csso())  // minify css
    .pipe(gulp.dest(config.dist + '/styles'))
    .pipe(size());
});
