let gulp = require('gulp');
let plumber = require('gulp-plumber');
let notify = require("gulp-notify");
let concat = require('gulp-concat');
let rename = require("gulp-rename");

let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let mmq = require('gulp-merge-media-queries');
let cleanCSS = require('gulp-clean-css');
let sourcemaps = require('gulp-sourcemaps');

let pug = require('gulp-pug');
let clean = require('gulp-clean');

let uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');


let src = {
	html: [
  'dev/index.pug'
  ],
	style: [
    'dev/variables.sass',
		'dev/mixins.sass', 
		'dev/general.sass', 
	],
	script: []
};

let list = [
  'menu', 
  'main',
  'other', 
];



for (let i = 0; i < list.length; i++) {
  src.style.push(`dev/components/` + list[i] + `/**.sass`);
  src.script.push(`dev/components/` + list[i] + `/**.js`);
}

gulp.task('pug2html', function buildHTML() {
  return gulp.src(src.html)
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(pug({ pretty: true }))
	.pipe(gulp.dest('production/'))
});

gulp.task('style:dev', function() {
  return gulp.src(src.style)
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sourcemaps.init())
  .pipe(concat('style.sass'))
  .pipe(sass())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('production/'))
});

gulp.task('style:pro', function() {
  return gulp.src(src.style)
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(concat('style.sass'))
  .pipe(sass())
  .pipe(mmq({ 
    log: true, 
  }))
  .pipe(autoprefixer())
  .pipe(cleanCSS({ level: 2}))
  .pipe(gulp.dest('production/'))
  .pipe(notify());
});

gulp.task('script:dev', function () {
  return gulp.src(src.script)
  .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
  .pipe(concat('all.js'))
  .pipe(gulp.dest('production/'))
});
  
gulp.task('script:pro', function() {
  return gulp.src(src.script)
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(gulp.dest('production/'))
  .pipe(notify());
});

gulp.task('clean', function () {
  return gulp.src('./production/*', {read: false})
  .pipe(clean()) 
});

gulp.task('image:dev', function () {
  return gulp.src('./dev/components/**/images/*.+(png|jpg|svg)')
  .pipe(rename({
    dirname: "images",
  }))
  .pipe(gulp.dest('production/'));
});

gulp.task('image:pro', function () {
  return gulp.src('./dev/components/**/images/*.+(png|jpg|svg)')
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
  .pipe(gulp.dest('production/'));
});


gulp.task('watch:dev', function() {
  gulp.watch('dev/index.pug', gulp.parallel('pug2html'));
  gulp.watch('dev/components/**/*.pug', gulp.parallel('pug2html'));
  gulp.watch(src.style, gulp.parallel('style:dev'));
  gulp.watch(src.script, gulp.parallel('script:dev'));
  gulp.watch('dev/components/**/images/*', gulp.parallel('image:dev'));
});

gulp.task('dev', gulp.series(
  // gulp.parallel('clean'),
  gulp.parallel('pug2html', 'style:dev', 'script:dev', 'image:dev'),
  gulp.parallel('watch:dev')
));


gulp.task('watch:pro', function () {
  gulp.watch('dev/components/**', gulp.parallel('pug2html'));
  gulp.watch(src.style, gulp.parallel('style:pro'));
  gulp.watch(src.script, gulp.parallel('script:pro'));
  gulp.watch('dev/components/*/images/*', gulp.parallel('image:pro'));
});

gulp.task('pro', gulp.series(
  gulp.parallel('clean'),
  gulp.parallel('pug2html', 'style:pro', 'script:pro', 'image:pro'),
  gulp.parallel('watch:pro')
));
  