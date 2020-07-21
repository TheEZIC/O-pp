const
    gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');

gulp.task('scripts', () => {
    return ( 
        browserify('./scripts/index.js')
        .bundle()
        .pipe(source('./popup.js'))
        .pipe(gulp.dest('./'))
    )
})

gulp.task('default', () => {
    return gulp.watch('./scripts/**/*.js', gulp.parallel(['scripts']));
});