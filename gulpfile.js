const gulp = require('gulp');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');

gulp.task("js", function(){
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    }).plugin(tsify)
    .transform('babelify', {
        presets: ['@babel/preset-env'],
        extensions: ['.ts']
    }).on('error', console.error.bind(console))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function(){
    return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch',gulp.series('js', 'sass', function(done) {
    browserSync.reload();
    done();
}));

gulp.task('default', gulp.series('js', 'sass', function(){
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch(['src/**/*.ts', 'src/**/*.scss'], gulp.series('watch'));
}));