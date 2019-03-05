const gulp = require('gulp');

// CSS
const sass = require('gulp-sass');
const minifyCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');

// JS
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

// Images

const imagemin = require('gulp-imagemin');

// Utilities
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const server = browserSync.create();

// Styles
gulp.task('styles', () => {
    return (
        gulp
            .src('./src/scss/*.scss')
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(autoprefixer())
            // .pipe(minifyCSS())
            .pipe(rename({ suffix: '.min' }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/css'))
            .pipe(
                notify({
                    message: 'Task: styles completed',
                    onLast: true
                })
            )
    );
});

// Styles: build
gulp.task('styles:build', () => {
    return (
        gulp
            .src('./src/scss/*.scss')
            .pipe(plumber())
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(autoprefixer())
            // .pipe(minifyCSS())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('./dist/css'))
            .pipe(
                notify({
                    message: 'Task: styles:build completed',
                    onLast: true
                })
            )
    );
});

// Scripts (vendor)
gulp.task('vendorjs', () => {
    return gulp
        .src('./src/js/vendor/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('vendor.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(
            notify({
                message: 'Task: vendorjs completed',
                onLast: true
            })
        );
});

// Scripts (vendor): build
gulp.task('vendorjs:build', () => {
    return gulp
        .src('./src/js/vendor/*.js')
        .pipe(plumber())
        .pipe(babel())
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(
            notify({
                message: 'Task: vendorjs:build completed',
                onLast: true
            })
        );
});

// Scripts (custom)
gulp.task('customjs', () => {
    return gulp
        .src('./src/js/custom/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('custom.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(
            notify({
                message: 'Task: customjs completed',
                onLast: true
            })
        );
});

// Scripts (custom): build
gulp.task('customjs:build', () => {
    return gulp
        .src('./src/js/custom/*.js')
        .pipe(plumber())
        .pipe(babel())
        .pipe(concat('custom.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(
            notify({
                message: 'Task: customjs:build completed',
                onLast: true
            })
        );
});

// Images
gulp.task('images', () => {
    return gulp
        .src('./src/img/*')
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
                })
            ])
        )
        .pipe(gulp.dest('./dist/img'))
        .pipe(
            notify({
                message: 'Task: images completed',
                onLast: true
            })
        );
});

// Fonts
gulp.task('fonts', () => {
    return gulp
        .src('./src/fonts/**.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('./dist/fonts'))
        .pipe(
            notify({
                message: 'Task: fonts completed',
                onLast: true
            })
        );
});

// Clean
gulp.task('clean', () => {
    return del(['./dist/**', '!./dist']);
});

// BrowserSync
function reload(done) {
    server.reload();
    done();
}
function serve(done) {
    server.init({
        server: {
            baseDir: './'
        }
    });
    done();
}

// Watch
gulp.task(
    'default',
    gulp.series(
        'clean',
        gulp.parallel(
            'styles',
            'vendorjs',
            'customjs',
            'images',
            'fonts',
            serve,
            function watchFiles() {
                gulp.watch('./src/scss/*.scss', gulp.series('styles', reload));
                gulp.watch('./src/js/vendor/*.js', gulp.series('vendorjs', reload));
                gulp.watch('./src/js/custom/*.js', gulp.series('customjs', reload));
                gulp.watch('./src/img/*', gulp.series('images', reload));
                gulp.watch('./src/fonts/**.{eot,svg,ttf,woff,woff2}', gulp.series('fonts', reload));
            }
        )
    )
);

// Build
gulp.task(
    'build',
    gulp.series(
        'clean',
        gulp.parallel('styles:build', 'vendorjs:build', 'customjs:build', 'images', 'fonts')
    )
);
