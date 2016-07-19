/**
 * Created by flash on 13.06.16.
 */
var sass = require('gulp-sass'),
    gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    lr = require('tiny-lr'),
    server = lr();

gulp.task('sass', function(){
  gulp.src('scss/main.scss')
    .pipe(sass()) // Using gulp-scss  sass({outputStyle: 'compressed'})
    .pipe(gulp.dest('css'))
});

gulp.task('http-server', function() {
    connect()
        .use(require('gulp-livereload')())
        .use(serveStatic('.'))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});

gulp.task('watch', function() {
    gulp.run('sass');
    server.listen(35729, function(err) {
        if (err) return console.log(err);
        gulp.watch('scss/**/*.scss', function() {
            gulp.run('sass');
        });
    });
    gulp.run('http-server');
});