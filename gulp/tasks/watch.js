'use strict'

var gulp = require('gulp')
var livereload = require('gulp-livereload')

// Watch
gulp.task('watch', ['connect', 'serve'], function () {
  livereload.listen()
    // Watch for changes in `app` folder
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    '.tmp/**/*'
  ])

    // Watch .less files
  gulp.watch('app/less/**/*.less', ['styles'])

    // Watch .js files
  gulp.watch('app/scripts/**/*.js', ['browserify'])

    // Watch image files
  gulp.watch('app/images/**/*', ['images'])

    // Watch .html files
  gulp.watch('app/**/*.html', ['html'])
})
