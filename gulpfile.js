var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var notify = require('gulp-notify');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var paths = {
    scripts: 'js/**/*.js',
    jsx: 'js/**/*.jsx'
};

gulp.task('jsx', function() {
    return gulp
        .src(paths.jsx)
        .pipe(react())
        .pipe(gulp.dest('js/'));
});

gulp.task('jshint', function() {
    return gulp
    .src(paths.scripts)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
});

gulp.task('scripts', function() {
    return browserify('./js/wopidy.js')
    .bundle()
    .pipe(source('wopidy.js'))
    .pipe(gulp.dest('build/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('build/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('watch', function() {
    // jsx task will trigger scripts task when writing js files
    gulp.watch(paths.jsx, ['jsx']);
    gulp.watch(paths.scripts, ['jshint', 'scripts']);
});

gulp.task('default', ['jsx', 'jshint', 'scripts', 'watch']);