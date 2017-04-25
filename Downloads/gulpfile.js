const gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    runSequence = require('run-sequence'),
    del = require('del'),
    path = require('path'),
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')();

const reload = browserSync.reload;

const conf = {
    dist: "dist",
    distApp: "dist/app",
    distServer: "dist/server",

    src: "client/app/",
    assets: "client/assets/",
    dev: true
};

// inject bower components
gulp.task('wiredep', () => {
    gulp.src(conf.src + '**/*.scss')
        .pipe($.filter(file => file.stat && file.stat.size))
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)+/
        }))
        .pipe(gulp.dest(conf.distApp));

    gulp.src(conf.src + "index.html").pipe(gulp.dest(conf.distApp));

    gulp.src(conf.distApp + 'index.html')
        .pipe(wiredep({
            exclude: ['bootstrap'],
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('styles', () => {
    return gulp.src(conf.src + '**/*.scss')
        .pipe($.plumber())
        .pipe($.if(conf.dev, $.sourcemaps.init()))
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.if(conf.dev, $.sourcemaps.write()))
        .pipe(gulp.dest(conf.distApp))
        .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
    return gulp.src(conf.src + '**/*.js')
        .pipe($.plumber())
        .pipe($.if(conf.dev, $.sourcemaps.init()))
        .pipe($.babel())
        .pipe($.if(conf.dev, $.sourcemaps.write('.')))
        .pipe(gulp.dest(conf.distApp))
        .pipe(reload({stream: true}));
});

gulp.task('clean', del.bind(null, [conf.dist]));

gulp.task('serve:local', () => {
    runSequence(['clean', 'wiredep'], ['styles', 'scripts'], () => {
        browserSync.init({
            notify: false,
            port: 9000,
            server: {
                baseDir: [conf.dist],
                routes: {
                    '/bower_components': 'bower_components'
                }
            }
        });

        gulp.watch([
            conf.distApp + '**/*.html',
            conf.distApp + '**/*.css',
            conf.distApp + '**/*.js',
            conf.distApp + 'assets/images/**/*'
        ]).on('change', reload);

        gulp.watch(conf.src + '/**/*.scss', ['styles']);
        gulp.watch(conf.src + '/**/*.ts', ['scripts']);
        gulp.watch('bower.json', ['wiredep']);
    });
});