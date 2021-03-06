const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

function transpileAndUglify() {
  return gulp.src('src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
}

function minifyCSS() {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'));
}

function sync() {
  
  browserSync.init({
    files: [".html", "src/.css", "src/*.js"],
    server: {
      baseDir: "./dist"
    }
  });
}

function copyHTML() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
}

function watchFiles() {
  gulp.watch('src/css/*.css', minifyCSS);
  gulp.watch('src/js/*.js', transpileAndUglify);
  gulp.watch('src/index.html', copyHTML);
}

exports.default = gulp.parallel(minifyCSS, transpileAndUglify, copyHTML, watchFiles, sync);