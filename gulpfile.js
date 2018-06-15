var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReaplce = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
// var gulpCopy = require('gulp-copy');
var sequence = require('run-sequence');

var config = {
    dist: 'dist/',
    src: 'src/',
    cssin: 'src/css/**/*.css',
    jsin: 'src/js/**/*.js',
    imgin: 'src/images/**/*.{jpg,jpeg,png,gif}',
    htmlin: 'src/*.html',
    scssin: 'src/scss/**/*.scss',
    cssout: 'dist/css/',
    jsout: 'dist/js/',
    imgout: 'dist/images/',
    htmlout: 'dist/',
    scssout: 'src/css/',
    cssoutname: 'style.css',
    jsoutname: 'script.js',
    cssreplaceout: 'css/style.css',
    jsreplaceout: 'js/script.js',
    assets: 'src/assets/**/*.{js,css,jpg,jpeg,png,gif,ttf,woff,woff2,eot,eof,otf,svg}',
    assetsout: 'dist/assets/',
    fonts: 'src/fonts/**/*.{ttf,woff,woff2,eot,eof,otf,svg}',
    fontsout: 'dist/fonts/'
};

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('serve', ['sass'], function () {
    browserSync({
        server: config.src
    });

    gulp.watch([config.htmlin, config.jsin], ['reload']);
    gulp.watch(config.scssin, ['sass']);
});

gulp.task('sass', function () {
    return gulp.src(config.scssin)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.scssout))
        .pipe(browserSync.stream());
});

gulp.task('css', function () {
    return gulp.src(config.cssin)
        .pipe(concat(config.cssoutname))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.cssout));
});

gulp.task('assets', function () {
    return gulp.src(config.assets)
        .pipe(gulp.dest(config.assetsout));
});

gulp.task('fonts', function () {
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.fontsout));
});

gulp.task('js', function () {
    return gulp.src(config.jsin)
        .pipe(concat(config.jsoutname))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsout));
});

gulp.task('img', function () {
    return gulp.src(config.imgin)
        .pipe(changed(config.imgout))
        .pipe(imagemin())
        .pipe(gulp.dest(config.imgout));
});

gulp.task('html', function () {
    return gulp.src(config.htmlin)
        .pipe(htmlReaplce({
            'css': config.cssreplaceout,
            'js': config.jsreplaceout
        }))
        .pipe(htmlMin({
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(config.dist))
});

gulp.task('clean', function () {
    return del([config.dist]);
});

gulp.task('build', function () {
    sequence('clean', [
        'html',
        'css',
        'img',
        'fonts'
    ]);
});

gulp.task('default', ['serve']);
