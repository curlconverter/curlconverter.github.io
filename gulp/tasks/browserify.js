'use strict'

var browserify = require('browserify')
var config = require('../config')
var partialify = require('partialify')
var gulp = require('gulp')
var rename = require('gulp-rename')
var rev = require('gulp-rev')
var source = require('vinyl-source-stream')

var uglify = require('gulp-uglify')
var buffer = require('vinyl-buffer')
var livereload = require('gulp-livereload')

// Browserify
gulp.task('browserify', function () {
  return browserify({debug: true})
    .add('./app/scripts/main.js')
    .transform(partialify) // Transform to allow requireing of templates
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(config.dist + '/scripts/'))
    .pipe(livereload())
})

// Script Dist
gulp.task('scripts:dist', function () {
  return gulp.src(['dist/scripts/*.js'], {base: 'dist'})
    .pipe(gulp.dest('dist'))
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(rename('script-manifest.json'))
    .pipe(gulp.dest('dist'))
})
