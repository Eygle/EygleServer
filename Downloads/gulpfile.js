const gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    runSequence = require('run-sequence'),
    del = require('del'),
    path = require('path'),
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')();

const reload = browserSync.reload;

const dist = ".dist";
const conf = {
    serve: dist + "/serve/",
    distServer: dist + "/server/",

    src: "client/",
    dev: true
};

// inject bower components
gulp.task('wiredep', () => {
    const injectOption = {
        ignorePath: [conf.serve],
        addRootSlash: false
    };

    gulp.src(conf.src + 'index.html')
        .pipe($.inject(gulp.src([conf.serve + "**/*.css"]), injectOption))
        .pipe($.inject(gulp.src([conf.serve + "**/*.js"]), injectOption))
        .pipe(wiredep({}))
        .pipe(gulp.dest(conf.serve));
});

gulp.task('styles', () => {
    return gulp.src(conf.src + '**/*.scss', {base: 'client'})
        .pipe($.plumber())
        .pipe($.if(conf.dev, $.sourcemaps.init()))
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.if(conf.dev, $.sourcemaps.write()))
        .pipe(gulp.dest(conf.serve))
        .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
    return gulp.src(conf.src + '**/*.ts', {base: 'client'})
        .pipe($.typescript({removeComments: false, target: 'es5'}))
        .pipe(gulp.dest(conf.serve))
        .pipe(reload({stream: true}));
});

gulp.task('misc', () => {
    return gulp.src([
        conf.src + '**/*.html',
        conf.src + '/**/i18n/*.json',
        conf.src + 'assets/**'
    ], {base: 'client'})
        .pipe(gulp.dest(conf.serve))
        .pipe(reload({stream: true}));
});

gulp.task('clean', del.bind(null, [dist]));

gulp.task('serve:local', () => {
    runSequence(['clean'], ['styles', 'scripts', 'misc'], 'wiredep', () => {
        browserSync.init({
            notify: false,
            port: 9000,
            open: false,
            server: {
                baseDir: [conf.serve],
                routes: {
                    '/bower_components': 'bower_components'
                }
            }
        });

        gulp.watch([
            conf.serve + '**/*.html',
            conf.serve + '**/*.css',
            conf.serve + '**/*.js',
            conf.serve + 'assets/images/**/*'
        ]).on('change', reload);

        gulp.watch(conf.src + '/**/*.scss', ['styles']);
        gulp.watch(conf.src + '/**/*.ts', ['scripts']);
    });
});