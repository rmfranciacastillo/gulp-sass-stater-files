'user strict';

// Load Plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const { series, parallel, src, dest } = require('gulp');

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
    .pipe(gulp.dest('build'));
}

// clean 
function clean(cb) {
  cb();
}

// Default task
function defaultTask(cb) {
  // place code for your default task here
  cb();
}

// CSS Task 
function css(cb) {
  cb();
}

exports.js = js;
exports.build = parallel(css, js); 
exports.default = series(clean, parallel(css, js), defaultTask);

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
