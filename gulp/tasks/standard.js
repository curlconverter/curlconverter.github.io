var gulp = require('gulp')
var standard = require('gulp-standard')

gulp.task('standard', function () {
  return gulp.src(['./app/scripts/main.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})
