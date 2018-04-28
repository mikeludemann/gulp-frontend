// Load Plugins / Packages from gulp

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var coffee = require('gulp-coffee');
var less = require('gulp-less');
var sass = require('gulp-sass');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var browsersync = require('browser-sync').create();

// Coffeescript Task
gulp.task('coffee', function () {
    gulp.src('src/script/coffee/*.coffee')
        .pipe(coffee({
            bare: true
        }))
        .pipe(gulp.dest('src/script/'));
});

// JS Task
gulp.task('scripts', function () {
    return gulp.src('src/scripts/*.js')
        .pipe(jshint('src/scripts/.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/scripts/'));
});

// Precompiler SASS and Watch Task
gulp.task('sass', function () {
    return gulp.src('src/styles/sass/*.scss')
        .pipe(concat('styles.scss'))
        .pipe(gulp.dest('src/styles/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('src/styles/sass/*.scss', ['sass']);
});

// Precompiler Less and Watch Task
gulp.task('less', function () {
    return gulp.src('src/styles/less/*.less')
        .pipe(less())
        .pipe(concat('styles.less'))
        .pipe(gulp.dest('src/styles/'));
});

gulp.task('less:watch', function () {
    gulp.watch('src/styles/less/*.less', ['less']);
});

// Precompiler Stylus and Watch Task
gulp.task('stylus', function () {
    return gulp.src('src/styles/stylus/*.styl')
        .pipe(stylus())
        .pipe(concat('styles.styl'))
        .pipe(gulp.dest('src/styles/'));
});

gulp.task('stylus:watch', function () {
    gulp.watch('src/styles/stylus/*.styl', ['stylus']);
});

// CSS Task
gulp.task('styles', function () {
    return gulp.src('src/styles/*.css')
        .pipe(csslint('src/styles/.csslintrc'))
        .pipe(csslint.formatter())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(concat('styles.css'))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('src/styles/'));
});

// Images Task
gulp.task('images', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('src/images/min/'))
});

// HTML Task
gulp.task('html-minify', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('/min/html'));
});

// Watch Task
gulp.task('watch', function(){
    gulp.watch('src/styles/*.css', gulp.series('styles', browsersync.reload));
    gulp.watch('src/scripts/*.js', gulp.series('scripts', browsersync.reload));
    gulp.watch('src/images/*', gulp.series('images', browsersync.reload));
});

// Static Server and watching files Task
gulp.task('bs', function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("src/script/coffee/*.coffee", ['coffee']);
    gulp.watch("src/styles/sass/*.scss", ['sass']);
    gulp.watch("src/styles/less/*.less", ['less']);
    gulp.watch("src/styles/stylus/*.styl", ['styl']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Execute Tasks
gulp.task("default", gulp.parallel('scripts', 'styles', 'images', 'watch'));
gulp.task("minify", gulp.parallel('html-minify',))
gulp.task("style_precompiler", gulp.parallel('sass', 'less', 'stylus'));
gulp.task("script_precompiler", gulp.parallel('coffee'));
gulp.task("server", gulp.parallel('server', 'bs'));