var args, browserSync, browserSyncInit, buildPaths, cleanCss, coffee, coffeelint, concat, connect, fs, gulp, gutil, imagemin, metaTags, path, paths, plumber, prefix, pug, rename, replace, sass, sh, sourcemaps, svgmin, svgstore, urlPaths;

gulp = require('gulp');

gutil = require('gulp-util');

rename = require('gulp-rename');

fs = require('fs');

sh = require('shelljs');

path = require('path');

browserSync = require('browser-sync');

concat = require('gulp-concat');

plumber = require('gulp-plumber');

connect = require('gulp-connect');

replace = require('gulp-batch-replace');

args = require('yargs');

sourcemaps = require('gulp-sourcemaps');

sass = require('gulp-sass');

cleanCss = require('gulp-clean-css');

prefix = require('gulp-autoprefixer');

pug = require('gulp-pug');

coffee = require('gulp-coffee');

coffeelint = require('gulp-coffeelint');

imagemin = require('gulp-imagemin');

svgstore = require('gulp-svgstore');

svgmin = require('gulp-svgmin');

paths = {
  pug: ['./app/views/**/*.pug', '!./app/views/mixins/*.pug'],
  sass: ['./app/assets/stylesheets/app.scss'],
  coffee: ['./app/assets/coffeescripts/**/*.coffee'],
  images: ['./app/assets/images/**/*'],
  svg: ['./app/assets/svg/**/*'],
  fonts: ['./app/assets/fonts/**/*'],
  copy: ['./app/assets/javascripts/**/*'],
  js: ['./app/assets/javascripts/**/*'],
  docs: ['./app/assets/docs/**/*'],
  favicon: ['./app/favicons/*']
};

buildPaths = {
  pug: './build/app/',
  sass: './build/app/assets/stylesheets/',
  coffee: './build/app/assets/js/',
  images: './build/app/assets/images/',
  docs: './build/app/assets/docs/',
  svg: './app/views/parts/',
  copy: './build/app/assets',
  favicon: './build/app/'
};

urlPaths = {
  prod: [['DYNAMIC_URL_PROMO_PAGE', 'https://doczilla.ru'], ['DYNAMIC_URL_REQUEST_API', 'https://forms.doczilla.ru'], ['DYNAMIC_URL_FREE_FORMS', 'https://forms.doczilla.ru/#/Branch/free'], ['DYNAMIC_URL_MAIN_PAGE', 'https://forms.doczilla.ru/'], ['DYNAMIC_URL_ADVICES', 'https://forms.doczilla.ru/#/bookAdvice'], ['DYNAMIC_URL_USER_HELP', 'https://forms.doczilla.ru/#/userHelp#0&1']],
  test: [['DYNAMIC_URL_PROMO_PAGE', 'https://promo.obt-vlg.ru'], ['DYNAMIC_URL_REQUEST_API', 'https://doczilla.obt-vlg.ru'], ['DYNAMIC_URL_FREE_FORMS', 'https://doczilla.obt-vlg.ru/#/Branch/free'], ['DYNAMIC_URL_MAIN_PAGE', 'https://doczilla.obt-vlg.ru/'], ['DYNAMIC_URL_ADVICES', 'https://doczilla.obt-vlg.ru/#/bookAdvice'], ['DYNAMIC_URL_USER_HELP', 'https://doczilla.obt-vlg.ru/#/userHelp#0&1']]
};

metaTags = {
  prod: [[/<!-- ONLY_FOR_PROD_STARTS-->([\s\S]*?)<!-- ONLY_FOR_PROD_ENDS-->/g, '$1'], [/<!-- ONLY_FOR_TEST_STARTS-->([\s\S]*?)<!-- ONLY_FOR_TEST_ENDS-->/g, '']],
  test: [[/<!-- ONLY_FOR_PROD_STARTS-->([\s\S]*?)<!-- ONLY_FOR_PROD_ENDS-->/g, ''], [/<!-- ONLY_FOR_TEST_STARTS-->([\s\S]*?)<!-- ONLY_FOR_TEST_ENDS-->/g, '$1']]
};

gulp.task('robots-sitemap', function(done) {
  var version;
  version = args.argv.mode === 'test' ? 'test' : 'prod';
  if (version === 'prod') {
    return gulp.src(['./app/robots.txt', './app/sitemap.xml']).pipe(gulp.dest('./build/app/'));
  }
});

gulp.task('sass', function(done) {
  return gulp.src(paths.sass).pipe(plumber()).pipe(sass()).on('error', sass.logError).pipe(prefix(['last 4 versions', 'ios_saf >= 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'])).pipe(cleanCss({
    keepSpecialComments: 0
  })).pipe(gulp.dest(buildPaths.sass));
});

gulp.task('pug', function(done) {
  var metaTagsReplacement, urlReplacement, version;
  version = args.argv.mode === 'test' ? 'test' : 'prod';
  urlReplacement = urlPaths[version];
  metaTagsReplacement = metaTags[version];
  return gulp.src(paths.pug).pipe(plumber()).pipe(pug()).pipe(replace(urlReplacement)).pipe(replace(metaTagsReplacement)).pipe(gulp.dest(buildPaths.pug));
});

gulp.task('coffee', function(done) {
  var urlReplacement, version;
  version = args.argv.mode === 'test' ? 'test' : 'prod';
  urlReplacement = urlPaths[version];
  return gulp.src(paths.coffee).pipe(plumber()).pipe(coffee({
    bare: true
  })).pipe(concat('app.js')).pipe(replace(urlReplacement)).pipe(gulp.dest(buildPaths.coffee));
});

gulp.task('js', function(done) {
  return gulp.src(paths.js).pipe(concat('vendor.js')).pipe(gulp.dest(buildPaths.coffee));
});

gulp.task('docs', function(done) {
  return gulp.src(paths.docs).pipe(gulp.dest(buildPaths.docs));
});

gulp.task('images', function(done) {
  return gulp.src(paths.images).pipe(gulp.dest(buildPaths.images));
});

gulp.task('copy', function(done) {
  return gulp.src(paths.favicon).pipe(gulp.dest(buildPaths.favicon));
});

gulp.task('images:optimize', function(done) {
  return gulp.src(paths.images).pipe(plumber()).pipe(imagemin({
    verbose: true
  })).pipe(gulp.dest(buildPaths.images));
});

gulp.task('svgstore', function() {
  gulp.src(paths.svg).pipe(svgmin(function(file) {
    prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [
        {
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }
      ]
    };
  })).pipe(svgstore()).pipe(gulp.dest(buildPaths.svg));
  return gulp.start('pug');
});

gulp.task('fonts', function(done) {
  return gulp.src(paths.fonts).pipe(gulp.dest('./build/app/assets/fonts/'));
});

gulp.task('lint:coffee', function(done) {
  return gulp.src(paths.coffee).pipe(coffeelint('./coffeelint.json')).pipe(coffeelint.reporter());
});

gulp.task('watch', function() {
  gulp.watch(['./app/assets/stylesheets/**/*.scss'], ['sass']);
  gulp.watch(['./app/views/**/*.pug'], ['pug']);
  gulp.watch(paths.coffee, ['coffee']);
  gulp.watch(paths.fonts, ['fonts']);
  gulp.watch(paths.svg, ['svgstore']);
  return gulp.watch(paths.copy, ['copy']);
});

gulp.task('myWatch', function() {
  return gulp.watch(['./build/**/*'], function() {
    return gulp.src('./build/').pipe(browserSync.stream());
  });
});

gulp.task('clean', function() {
  return sh.exec('rm -r build');
});

gulp.task('server', function() {
  return connect.server({
    root: ['./build/app'],
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

gulp.task('compile', ['clean', 'sass', 'pug', 'copy', 'js', 'docs', 'coffee', 'images', 'fonts', 'robots-sitemap']);

// ---
// generated by coffee-script 1.9.2