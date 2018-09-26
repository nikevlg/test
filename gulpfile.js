'use strict';
var gulp, gutil, browserSync, browserSyncInit, connect, 
	watch, myWatch, replace, args, sourcemaps, path, 
	paths, buildPaths, urlPaths, metaTags, plumber, sequence, clean, rigger, 
	rename, concat, sass, cleanCss, prefix, imagemin, 
	runTimestamp,  uglify, rename, htmlmin;

/*--Utils--*/
gulp        = require('gulp');
gutil       = require('gulp-util');
rename      = require('gulp-rename');
path        = require('path');
browserSync = require('browser-sync').create();
connect     = require('gulp-connect');
watch       = require('gulp-watch');
rigger      = require('gulp-rigger');
concat      = require('gulp-concat');
plumber     = require('gulp-plumber'); 
replace     = require('gulp-batch-replace');
args        = require('yargs');
sourcemaps  = require('gulp-sourcemaps');
clean       = require('gulp-clean');
sequence    = require('run-sequence');
htmlmin     = require('gulp-htmlmin');

/*--Styles--*/
sass        = require('gulp-sass'); 
cleanCss    = require('gulp-clean-css');
prefix      = require('gulp-autoprefixer');

/*--Js--*/
uglify = require('gulp-uglify');

/*--Images--*/
imagemin    = require('gulp-imagemin');

/*--Paths--*/
paths = { 
  templates: ['./src/templates/**/*.html', '!./src/templates/blocks/**/*.html'],
  templateswatch: './src/templates/**/*.html',
  tmp: './tmp/**/*.*',
  scss: './src/assets/styles/sass/**/*.scss',
  scripts: ['./src/assets/scripts/*.js'],
  images: ['./src/assets/images/*.*'],
  favicon: ['./src/favicon/*.*'],
  fonts: './src/assets/fonts/*.*',
  sasslibs: ['./src/libs/**/*.css', './src/libs/**/*.sass', './src/libs/**/*.scss', '!./src/libs/**/*.min.css'],
  scriptslibs: ['./src/libs/**/*.js', '!./src/libs/**/*.min.js']
};
 
buildPaths = {
  app: './build/',
  styles: './build/assets/css/',
  scripts: './build/assets/js/',
  docs: './build/assets/docs/',
  images: './build/assets/images/',
  fonts: './build/assets/fonts/',
  favicon: './build/favicon/'
};

// Urls in build modes
urlPaths = {
  prod: [
    ['DYNAMIC_URL', 'https:temp.ru']
  ],
  test: [
     ['DYNAMIC_URL', 'https:temp.ru']
  ]
};

/*--Tasks--*/
gulp.task('clean', function () {  
    return gulp.src(['build','tmp'], {read: false})
        .pipe(clean()); 
});

gulp.task('insertHtml', function () {
  var version = args.argv.mode === 'prod' ? 'prod':'test';
  var urlReplacement = urlPaths[version];
    return gulp.src(paths.templates)
        .pipe(rigger())
        .pipe(replace(urlReplacement))
        .pipe(gulp.dest('./tmp/'));
});

gulp.task('templates', ['insertHtml'], function() {
  var version = args.argv.mode === 'prod' ? 'prod':'test';
  if (version === 'prod') {
        return gulp.src(paths.tmp)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(buildPaths.app));
   };
  return gulp.src(paths.tmp)
  .pipe(gulp.dest(buildPaths.app));
});

gulp.task('sass', function() {
   return gulp.src(paths.scss)
   .pipe(plumber())
   .pipe(sass()).on('error', sass.logError)
   .pipe(prefix(['last 4 versions', 'ios_saf >= 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']))
   .pipe(cleanCss({
    keepSpecialComments: 0
  }))
   .pipe(gulp.dest(buildPaths.styles))
});

gulp.task('sass-libs', function() {
   return gulp.src(paths.sasslibs)
   .pipe(plumber())
   .pipe(sass()).on('error', sass.logError)
   .pipe(prefix(['last 4 versions', 'ios_saf >= 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']))
   .pipe(cleanCss({
    keepSpecialComments: 0
  }))
   .pipe(concat('vendor.css'))
   .pipe(gulp.dest(buildPaths.styles))
});

gulp.task('fontslibs', function() {
  return gulp.src(['./src/libs/**/*.eot', './src/libs/**/*.ttf', './src/libs/**/*.woff', './src/libs/**/*.woff2', './src/libs/**/*.svg', './src/libs/**/*.otf'])
  .pipe(rename({dirname: ''}))
  .pipe(gulp.dest('./tmp/fonts'));
});

gulp.task('fonts', function() {
  return gulp.src(['./tmp/fonts/*.*', paths.fonts])
  .pipe(gulp.dest(buildPaths.fonts));
});

gulp.task('js', function() {
  var version = args.argv.mode === 'prod' ? 'prod':'test';
  var urlReplacement = urlPaths[version]
  var pipe = gulp.src(paths.scripts)
                 .pipe(replace(urlReplacement));
  if (version === 'prod') {
    pipe.pipe(uglify());
  }
  return pipe.pipe(concat('scripts.min.js'))
             .pipe(gulp.dest(buildPaths.scripts));
});


gulp.task('js-libs', function() {
  return gulp.src(paths.scriptslibs)
  .pipe(uglify())
  .pipe(concat('vendor.min.js'))  
  .pipe(gulp.dest(buildPaths.scripts));
});


gulp.task('images', function() {
  return gulp.src(paths.images)
  .pipe(imagemin())
  .pipe(gulp.dest(buildPaths.images));
});

gulp.task('favicon', function() {
  return gulp.src(paths.favicon).pipe(gulp.dest(buildPaths.app));
});

gulp.task('server', function() {
  connect.server({
      root: ['./build/'],
      port: 4000
    });
});

gulp.task('compile', function (done) {
    sequence('clean', 'templates', 'fontslibs', 'fonts', 'sass', 'sass-libs', 'js', 'js-libs', 
             'images', 'favicon',  done);
});

gulp.task('default', ['compile', 'server'], function () {
    var version = args.argv.mode === 'prod' ? 'prod':'test';
      if (version !== 'prod') {
          gulp.start(['watch']); 
      }; 
});

gulp.task('watch', function() {
  browserSync.init({
        port: '4000',
        server: "./build"
    });
  gulp.watch(paths.scss, ['sass']).on('change', browserSync.reload);
  gulp.watch(paths.scripts, ['js']).on('change', browserSync.reload);
  gulp.watch(paths.images, ['images-reload']);
  gulp.watch(paths.templateswatch, ['template-reload']);
});

gulp.task('template-reload', ['templates'], function(done) {   
  browserSync.reload();
  done();
})

gulp.task('images-reload', ['images'], function(done) { 
  browserSync.reload();
  done();
})

// gulp - собрать без минификации
// gulp --mode prod - собрать минифицированную версию  (без автозапуска, на 4000 порту)
