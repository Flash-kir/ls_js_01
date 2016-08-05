/**
 * Created by flash on 13.06.16.
 */
var sass = require('gulp-sass'),
    gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    jade = require('gulp-jade'),
    browserify = require('gulp-browserify');

gulp.task('sass', function(){
  gulp.src('./src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()) // Using gulp-scss  sass({outputStyle: 'compressed'})
    .pipe(gulp.dest('./pub/css'));
});

gulp.task('jade', function() {
    var YOUR_LOCALS = {};
  gulp.src('./src/jade/index.jade')
    .pipe(jade({
        pretty: true,
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./pub/'));
});

gulp.task('scripts', function() {
    gulp.src(['./src/**/*.js'])
        .pipe(browserify())
        .pipe(concat('./index.js'))
        .pipe(gulp.dest('./pub/js'));
});

gulp.task('livereload', function() {
  gulp.src('./src/**/*.*', ['./src/**/*.scss', './src/**/*.js', './src/**/*.jade'])
    .pipe(watch('./src/**/*.*', ['./src/**/*.scss', './src/**/*.js', './src/**/*.jade']))
    .pipe(connect.reload());
});

gulp.task('webserver', function() {
  connect.server({
    livereload: true,
      root: ['./pub']
  });
});

gulp.task('watch', function() {
    gulp.watch('./src/**/*.jade', ['jade']);
    gulp.watch('./src/**/*.js', ['scripts']);
    gulp.watch('./src/**/*.scss', ['sass']);
});

gulp.task('default', ['sass','scripts','jade','webserver', 'livereload','watch']);