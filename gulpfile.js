'user strict';

const { 
  series, 
  parallel, 
  src, 
  dest, 
  watch 
} = require('gulp');

// Load Plugins
const del = require('del'); 
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

// Config
const { config }= require('./gulp.config');

// JS task
function js() {
  return src(config.alljs)
    .pipe(babel({
      presets: ['@babel/env'] 
    }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('_build'));
}

// clean build 
function clean(cb) {
  return del(["./_build"]);
}

// CSS Task 
function css(cb) {
  cb();
}

exports.css = css;
exports.build = parallel(css, js); 
exports.default = series(clean, parallel(css, js));

/*
const { series, parallel } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function cssTranspile(cb) {
  // body omitted
  cb();
}

function cssMinify(cb) {
  // body omitted
  cb();
}

function jsTranspile(cb) {
  // body omitted
  cb();
}

function jsBundle(cb) {
  // body omitted
  cb();
}

function jsMinify(cb) {
  // body omitted
  cb();
}

function publish(cb) {
  // body omitted
  cb();
}

exports.build = series(
  clean,
  parallel(
    cssTranspile,
    series(jsTranspile, jsBundle)
  ),
  parallel(cssMinify, jsMinify),
  publish
);
*/
