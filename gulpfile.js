const
    gulp = require('gulp'),
    browserify = require('browserify'),
    sass = require('gulp-sass')
    source = require('vinyl-source-stream');

gulp.task('scripts', () => {
    return ( 
        browserify('./scripts/index.js')
        .bundle()
        .pipe(source('./popup.js'))
        .pipe(gulp.dest('./'))
    )
})

gulp.task('styles', () => {
    return gulp.src('./style/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./'));
})

gulp.task('default', () => {
    gulp.watch('./scripts/**/*.js', gulp.parallel(['scripts']));
    gulp.watch('./style/**/*.scss', gulp.parallel(['styles']));
});