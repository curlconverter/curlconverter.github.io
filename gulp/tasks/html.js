'use strict';

var config = require('../config');
var gulp = require('gulp');
var size = require('gulp-size');
var livereload = require('gulp-livereload')

gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe(gulp.dest(config.dist))
    .pipe(size())
    .pipe(livereload());
});
