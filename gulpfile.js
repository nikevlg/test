'use strict';
var gulp, gutil, browserSync, browserSyncInit, connect, 
	watch, myWatch, replace, args, sourcemaps, path, 
	paths, buildPaths, urlPaths, metaTags, plumber, sequence, clean, rigger, 
	rename, concat, sass, 	cleanCss, prefix, imagemin, 
	iconfont, runTimestamp, iconfontCss, uglify, rename, htmlmin;

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

/*--svg Icons--*/
iconfont    = require('gulp-iconfont');
iconfontCss = require('gulp-iconfont-css');
runTimestamp = Math.round(Date.now()/1000);

/*--Paths--*/
paths = { 
  templates: ['./src/templates/**/*.html', '!./src/templates/blocks/**/*.html'],
  templateswatch: './src/templates/**/*.html',
  tmp: './tmp/**/*.*',
  svg: './src/promo-assets/svg/*.svg',
  svgTemplate: './src/promo-assets/svg/icon-font',
  scss: './src/promo-assets/styles/sass/**/*.scss',
  scripts: ['./src/promo-assets/scripts/*.js'],
  images: ['./src/promo-assets/images/*.*'],
  docs: ['./src/promo-assets/docs/*.*'],
  favicon: ['./src/favicon/*.*'],
  fonts: './src/promo-assets/fonts/*.*',
  sasslibs: ['./src/libs/**/*.css', './src/libs/**/*.sass', './src/libs/**/*.scss', '!./src/libs/**/*.min.css'],
  scriptslibs: ['./src/libs/**/*.js', '!./src/libs/**/*.min.js']
};
 
buildPaths = {
  app: './build/',
  styles: './build/promo/promo-assets/css/',
  scripts: './build/promo/promo-assets/js/',
  docs: './build/promo/promo-assets/docs/',
  images: './build/promo/promo-assets/images/',
  fonts: './build/promo/promo-assets/fonts/',
  favicon: './build/favicon/'
};

// Urls in build modes
urlPaths = {
  prod: [
    ['DYNAMIC_URL_MAIN_PAGE', 'https://doczilla.ru'],
    ['DYNAMIC_URL_REQUEST_API', 'https://doczilla.ru'],
    ['DYNAMIC_URL_FREE_FORMS', 'https://doczilla.ru/branch/besplatnye'],
    ['DYNAMIC_URL_FORMS', 'https://doczilla.ru/branch'],
    ['DYNAMIC_URL_ADVICES', 'https://doczilla.ru/bookAdvice'],
    ['DYNAMIC_URL_USER_HELP', 'https://doczilla.ru/userHelp#0&1'],
    ['DYNAMIC_URL_TARIFFS', 'https://doczilla.ru/tariffs'],
    ['DYNAMIC_URL_FORM_PRETENSION', 'https://doczilla.ru/form/666'],
    ['DYNAMIC_URL_FORM_CLAIM', 'https://doczilla.ru/form/669']
  ],
  test: [
    ['DYNAMIC_URL_MAIN_PAGE', 'https://doczilla.obt-vlg.ru'],
    ['DYNAMIC_URL_REQUEST_API', 'https://doczilla.obt-vlg.ru'],
    ['DYNAMIC_URL_FREE_FORMS', 'https://doczilla.obt-vlg.ru/branch/besplatnye'],
    ['DYNAMIC_URL_FORMS', 'https://doczilla.obt-vlg.ru/branch'], 
    ['DYNAMIC_URL_ADVICES', 'https://doczilla.obt-vlg.ru/bookAdvice'],
    ['DYNAMIC_URL_USER_HELP', 'https://doczilla.obt-vlg.ru/userHelp#0&1'],
    ['DYNAMIC_URL_TARIFFS', 'https://doczilla.obt-vlg.ru/tariffs'],
    ['DYNAMIC_URL_FORM_PRETENSION', 'https://doczilla.obt-vlg.ru/form/652'],
    ['DYNAMIC_URL_FORM_CLAIM', 'https://doczilla.obt-vlg.ru/form/653']
  ]
};

// Meta-tags in build modes
metaTags = {
  prod: [
    [/<!-- ONLY_FOR_PROD_STARTS-->([\s\S]*?)<!-- ONLY_FOR_PROD_ENDS-->/g, '$1'],
    [/<!-- ONLY_FOR_TEST_STARTS-->([\s\S]*?)<!-- ONLY_FOR_TEST_ENDS-->/g, '']
  ],
  test: [
    [/<!-- ONLY_FOR_PROD_STARTS-->([\s\S]*?)<!-- ONLY_FOR_PROD_ENDS-->/g, ''],
    [/<!-- ONLY_FOR_TEST_STARTS-->([\s\S]*?)<!-- ONLY_FOR_TEST_ENDS-->/g, '$1']
  ]
};


/*--Tasks--*/

gulp.task('robots-sitemap', function() {
  var version = args.argv.mode === 'prod' ? 'prod':'test';
  if (version === 'prod') {
    return gulp.src(['./src/robots.txt', './src/sitemap.xml']).pipe(gulp.dest('./build/'));
  };
});

gulp.task('clean', function () {  
    return gulp.src(['build','tmp'], {read: false})
        .pipe(clean()); 
});

gulp.task('insertHtml', function () {
  var version = args.argv.mode === 'prod' ? 'prod':'test';
  var urlReplacement = urlPaths[version];
  var metaTagsReplacement = metaTags[version];
    return gulp.src(paths.templates)
        .pipe(rigger())
        .pipe(replace(urlReplacement))
        .pipe (replace (metaTagsReplacement))
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

gulp.task('Iconfont', function(){
    return gulp.src(paths.svg)  //путь где лежат иконки
        .pipe(iconfontCss({
            fontName: 'doczilla-icons',
            cssClass: 'doc-icon',
            path: paths.svgTemplate, //путь до шаблона стилей 
            targetPath: '../_icon-fonts.scss', //путь вывода sass стилей иконок (от gulp.dest())
            fontPath: '../fonts/'//путь где лежат скомпиленные шрифты
        }))
        .pipe(iconfont({
            fontName: 'doczilla-icons',
            prependUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff', 'svg'], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp // recommended to get consistent builds when watching files
        }))
        .pipe(gulp.dest('./tmp/fonts'));
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

gulp.task('docs', function() {
  return gulp.src(paths.docs).pipe(gulp.dest(buildPaths.docs));
});

gulp.task('server', function() {
  connect.server({
      root: ['./build/'],
      port: 4000
    });
});

gulp.task('compile', function (done) {
    sequence('clean', 'templates', 'Iconfont', 'fontslibs', 'fonts', 'sass', 'sass-libs', 'js', 'js-libs', 
             'images', 'favicon', 'robots-sitemap', 'docs', done);
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

gulp.task('images-reload', ['images'], function(done) { //не работает на добавление картинок
  browserSync.reload();
  done();
})

// gulp - собрать test
// gulp --mode prod - собрать prod версию  (без автозапуска на 4000 порту)
