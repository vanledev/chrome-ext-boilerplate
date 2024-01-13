// gulpfile.js
const gulp = require("gulp");
const concat = require("gulp-concat");

// Task to concatenate JS files
gulp.task("scripts", function () {
  return gulp
    .src([
      "./content-scripts/main/jquery.min.js",
      "./content-scripts/main/general.js",
    ])
    .pipe(concat("main.js"))
    .pipe(gulp.dest("./content-scripts/"));
});

gulp.task("scripts2", function () {
  return gulp
    .src([
      "./injected/main/intercept.js",
      "./injected/main/jquery.min.js",
      "./injected/main/helpers.js",
      "./injected/main/general.js",
    ])
    .pipe(concat("main.js"))
    .pipe(gulp.dest("./injected/"));
});
// Default task
gulp.task("default", gulp.series("scripts", "scripts2"));
