const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
const concat = require('gulp-concat');
const rename = require("gulp-rename");

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const mmq = require('gulp-merge-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

const pug = require('gulp-pug');
const clean = require('gulp-clean');

const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

let src = {
	html: [
  'dev/index.pug'
  ],
	style: [
    'dev/fonts/stylesheet.sass',
    'dev/variables.sass',
		'dev/mixins.sass', 
		'dev/general.sass', 
    'dev/components/menu/menu.sass', 
    'dev/components/main/main.sass',
    'dev/components/other/other.sass', 
	],
	script: [
    'dev/components/menu/menu.js', 
    'dev/components/main/main.js',
  ],
  image: [
    './dev/favicon.ico', 
    './dev/components/**/images/*.+(png|jpg|svg)'
  ],
  font: './dev/fonts/*.+(woff|woff2)',
};

const error = { errorHandler: notify.onError("Error: <%= error.message %>") };
const prodScript = 'all.js'
const prod = 'production/';

gulp.task('pug2html', function buildHTML() {
  return gulp.src(src.html)
  .pipe(plumber(error))
  .pipe(pug({ pretty: true }))
	.pipe(gulp.dest(prod))
});

gulp.task('style:dev', function() {
  return gulp.src(src.style)
  .pipe(plumber(error))
  .pipe(sourcemaps.init())
  .pipe(concat('style.sass'))
  .pipe(sass())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(prod))
});

gulp.task('style:pro', function() {
  return gulp.src(src.style)
  .pipe(plumber(error))
  .pipe(concat('style.sass'))
  .pipe(sass())
  .pipe(mmq({ 
    log: true, 
  }))
  .pipe(autoprefixer())
  .pipe(cleanCSS({ level: 2}))
  .pipe(gulp.dest(prod))
  .pipe(notify());
});

gulp.task('script:dev', function () {
  return gulp.src(src.script)
  .pipe(plumber(error))
  .pipe(concat(prodScript))
  .pipe(gulp.dest(prod))
});
  
gulp.task('script:pro', function() {
  return gulp.src(src.script)
  .pipe(plumber(error))
  .pipe(concat(prodScript))
  .pipe(uglify())
  .pipe(gulp.dest(prod))
  .pipe(notify());
});

gulp.task('clean', function () {
  return gulp.src('./production/*', {read: false})
  .pipe(clean()) 
});

gulp.task('image:dev', function () {
  return gulp.src(src.image)
  .pipe(rename({
    dirname: "images",
  }))
  .pipe(gulp.dest(prod));
});

gulp.task('image:pro', function () {
  return gulp.src(src.image)
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ], 
  {
    verbose: true, 
  }
  ))
  .pipe(rename({
    dirname: "images",
  }))
  .pipe(gulp.dest(prod));
});

gulp.task('font', function () {
  return gulp.src(src.font)
  .pipe(gulp.dest('production/fonts/'));
});

gulp.task('watch:dev', function() {
  gulp.watch('dev/index.pug', gulp.parallel('pug2html'));
  gulp.watch('dev/components/**/*.pug', gulp.parallel('pug2html'));
  gulp.watch(src.style, gulp.parallel('style:dev'));
  gulp.watch(src.script, gulp.parallel('script:dev'));
  gulp.watch(src.font, gulp.parallel('font'));
  gulp.watch(src.image, gulp.parallel('image:dev'));
});

gulp.task('dev', gulp.series(
  gulp.parallel('clean'),
  gulp.parallel('pug2html', 'style:dev', 'script:dev', 'image:dev', 'font'),
  gulp.parallel('watch:dev')
  ));
  
  
  
  gulp.task('watch:pro', function () {
    gulp.watch('dev/index.pug', gulp.parallel('pug2html'));
    gulp.watch('dev/components/**/*.pug', gulp.parallel('pug2html'));
    gulp.watch(src.style, gulp.parallel('style:pro'));
    gulp.watch(src.script, gulp.parallel('script:pro'));
    gulp.watch(src.image, gulp.parallel('image:pro'));
    gulp.watch(src.font, gulp.parallel('font'));
});

gulp.task('pro', gulp.series(
  gulp.parallel('clean'),
  gulp.parallel('pug2html', 'style:pro', 'script:pro', 'image:pro', 'font'),
  gulp.parallel('watch:pro')
));
  