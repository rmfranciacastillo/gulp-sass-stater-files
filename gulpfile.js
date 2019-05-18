'user strict';

const {
  series,
  parallel,
  src,
  dest,
} = require('gulp');

// Load Plugins
const fs = require('fs');
const del = require('del');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

// Gulp Plugins
const useref = require('gulp-useref');
const inject = require('gulp-inject');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');

// Config
const { config } = require('./gulp.config');

sass.compiler = require('node-sass');

// clean build
function clean() {
  return del(['./_build']);
}

// HTML tasks
function userefTask() {
  return src(config.alltemplates)
    .pipe(useref())
    .pipe(dest('./_build'));
}

function injectTask() {
  const target = src(config.buildtemplates);
  const sources = src([config.buildjs, config.buildcss], { read: false });

  return target
    .pipe(inject(sources))
    .pipe(dest('./_build'));
}

// JS task
function js() {
  return src(config.alljs)
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('./_build/assets'));
}

// CSS Task
function css() {
  const processors = [
    autoprefixer(),
    cssnano(),
  ];

  return src(config.allsass)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('./_build/assets'));
}

function renameSassFolder(done) {
  fs.rename('./_build/assets/sass', './_build/assets/css', (err) => {
    if (err) throw err;
    done();
  });
}

const cssTask = series(css, renameSassFolder);
const htmlTask = series(userefTask, injectTask);

exports.html = htmlTask;
exports.build = parallel(css, js);
exports.default = series(clean, parallel(cssTask, js), htmlTask);
