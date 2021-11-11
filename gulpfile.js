'user strict';

const {
  series,
  parallel,
  src,
  dest,
  watch,
} = require('gulp');

// Node Plugins
const fs = require('fs');
const del = require('del');

// Load NPM Plugins
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();

// Gulp Plugins
const useref = require('gulp-useref');
const inject = require('gulp-inject');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Config
const { config } = require('./gulp.config');

// clean build
function clean() {
  return del(['./_build']);
}

// clean build:css
function cleanBuildCSS() {
  return del(['./_build/assets/css']);
}

// clean build:js
function cleanBuildJS() {
  return del(['./_build/assets/js']);
}

// HTML tasks
function templatesTask() {
  return src(config.alltemplates)
    .pipe(dest('./_build'));
}

function userefTask() {
  return src(config.buildtemplates)
    .pipe(useref())
    .pipe(dest((file) => file.base));
}

function injectTask() {
  const target = src(config.buildtemplates);
  const sources = src([config.buildjs, config.buildcss], { read: false });

  return target
    .pipe(inject(sources, { relative: true }))
    .pipe(dest('./_build'));
}

// CSS Task
function css() {
  const processors = [
    autoprefixer(),
    cssnano(),
  ];

  return src(config.index_scss)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(rename({ extname: '.min.css' }))
		.pipe(dest('./_build/assets/scss'))
	  .pipe(browsersync.stream());
}

function renameSassFolder(done) {
  fs.rename('./_build/assets/scss', './_build/assets/css', (err) => {
    if (err) throw err;
    done();
  });
}

// JS task
function js() {
  return src(config.alljs)
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('./_build/assets'))
    .pipe(browsersync.stream());
}

// BrowserSync
function browserSyncTask(done) {
  browsersync.init({
    server: {
      baseDir: './_build/',
    },
    port: 3000,
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function watchFiles() {
  // JS and CSS Watch
  watch(config.allscss, series(cleanBuildCSS, css, renameSassFolder));
  watch(config.alljs, series(cleanBuildJS, js));

  // HTML watch
  watch(config.alltemplates, series(templatesTask, userefTask, injectTask, browserSyncReload));
}

const watchTask = parallel(watchFiles, browserSyncTask);
const cssTask = series(css, renameSassFolder);
const htmlTask = series(templatesTask, userefTask, injectTask);

exports.html = htmlTask;
exports.build = parallel(css, js);
exports.clean = clean;
exports.default = series(clean, parallel(cssTask, js), htmlTask, watchTask);
