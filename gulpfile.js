const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify-es').default;
const htmlmin = require('gulp-htmlmin');

gulp.task('clean', () => {
    return gulp.src('dist')
        .pipe(clean());
});

gulp.task('uglify-js', () => {
    return gulp.src('src/*.js', {allowEmpty: true})
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
});

gulp.task('minify-styles', () => {
    return gulp.src('src/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-assets', () => {
    return gulp.src(['src/assets/**/*'])
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('copy-files', () => {
    return gulp.src(['src/manifest.json'])
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-html', () => {
    return gulp.src('src/popup.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', gulp.parallel(['copy-assets', 'copy-files']));
gulp.task('default', gulp.series(['clean', 'copy', 'minify-styles', 'uglify-js', 'minify-html']));
