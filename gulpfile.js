'use strict';
var gulp, gutil, browserSync, browserSyncInit, connect, 
	watch, myWatch, replace, args, sourcemaps, path, 
	paths, buildPaths,urlPaths, plumber, clean, rigger, 
	rename, concat, sass, 	cleanCss, prefix, imagemin, 
	iconfont, iconfontCss;

/*--Utils--*/
gulp        = require('gulp');
gutil       = require('gulp-util');
rename      = require('gulp-rename');
path        = require('path');
browserSync = require('browser-sync');
connect     = require('gulp-connect');
watch       = require('gulp-watch');
rigger      = require('gulp-rigger');
concat      = require('gulp-concat');
plumber     = require('gulp-plumber'); 
replace     = require('gulp-batch-replace');
args        = require('yargs');
sourcemaps  = require('gulp-sourcemaps');
clean       = require('gulp-clean');

/*--Styles--*/
sass        = require('gulp-sass'); 
cleanCss    = require('gulp-clean-css');
prefix      = require('gulp-autoprefixer');

/*--Images--*/
imagemin    = require('gulp-imagemin');

/*--svg Icons--*/
iconfont    = require('gulp-iconfont');
iconfontCss = require('gulp-iconfont-css');

var runTimestamp = Math.round(Date.now()/1000);

/*--Paths--*/
paths = { 
  templates: ['./src/templates/**/*.html', '!./src/templates/blocks/**/*.html'],
  tmp: './tmp/**/*.*',
  svg: './src/assets/svg/*.svg',
  svgTemplate: './src/assets/svg/icon-font',

};

buildPaths={
  app: './build/'
};

/*--Tasks--*/
gulp.task('clean', function () {  
    return gulp.src(['build','tmp'], {read: false})
        .pipe(clean()); 
});

gulp.task('insertHtml', function () {
    gulp.src(paths.templates)
        .pipe(rigger())
        .pipe(gulp.dest('./tmp/'));
});

gulp.task('templates', ['insertHtml'], function(done) {
  return gulp.src(paths.tmp)
  .pipe(gulp.dest(buildPaths.app));
});

gulp.task('Iconfont', function(){
    return gulp.src(paths.svg)  //путь где лежат иконки
        .pipe(iconfontCss({
            fontName: 'doczilla-icons',
            cssClass: 'doc-icon',
            path: paths.svgTemplate, //путь до шаблона стилей 
            targetPath: '../styles/sass/_icon-fonts.scss', //путь вывода sass стилей иконок
            fontPath: '../../fonts/'//путь где лежат скомпиленные шрифты
        }))
        .pipe(iconfont({
            fontName: 'doczilla-icons',
            prependUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff', 'svg'], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp // recommended to get consistent builds when watching files
        }))
        .pipe(gulp.dest('./src/assets/fonts/'));
});

/*===============================================================*/

gulp.task('watch', function() {
  gulp.watch(paths.templates);
  return gulp.watch(paths.templates, ['templates']);
});


gulp.task('myWatch', function() {
  return gulp.watch(['./build/'], function() {
    return gulp.src('./build/').pipe(browserSync.stream());
  });
});

gulp.task('server', function() {
  return connect.server({
    root: ['./build'],
    port: 4000
  });
});

browserSyncInit = function(browser) {
  browser = browser === void 0 ? 'default' : browser;
  browserSync.instance = browserSync.init({
    startPath: '/',
    browser: browser,
    port: '4000',
    proxy: 'http://localhost:4000/'
  });
};


gulp.task('serve', ['watch', 'myWatch'], function() {
  browserSyncInit();
});
gulp.task('default', ['compile', 'serve', 'server']);
gulp.task('compile', ['clean', 'templates']);