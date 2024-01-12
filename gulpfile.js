// gulpfile.js
const gulp = require('gulp');
const concat = require('gulp-concat');

// Task to concatenate JS files
gulp.task('scripts', function () {
  return gulp.src(['./content-scripts/main/jquery.min.js', './content-scripts/main/general.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./content-scripts/'));
});

// Default task
gulp.task('default', gulp.series('scripts'));
