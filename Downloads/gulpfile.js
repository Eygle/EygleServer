/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

const gulp = require('gulp')
  , wrench = require('wrench');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function (file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function (file) {
  require('./gulp/' + file);
});


/**
 *  Default task launch the main optimization build task
 */
gulp.task('default', ['dev:serve'], function () {
});


// const gulp = require('gulp'),
//   wiredep = require('wiredep').stream,
//   runSequence = require('run-sequence'),
//   del = require('del'),
//   path = require('path'),
//   $ = require('gulp-load-plugins')(),
//   livereload = require("gulp-livereload");
//
// const dist = ".dist";
// const conf = {
//   serve: dist + "/serve/",
//   distServer: dist + "/server/",
//
//   src: "client/",
//   server: "server/",
//   dev: true,
//
//   errorHandler: (title) => {
//     return (err) => {
//       gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
//       this.emit('end');
//     };
//   }
// };
//
// gulp.task('styles', () => {
//   return gulp.src(conf.src + '**/*.scss', {base: 'client'})
//     .pipe($.plumber())
//     .pipe($.if(conf.dev, $.sourcemaps.init()))
//     .pipe($.sass.sync({
//       outputStyle: 'expanded',
//       precision: 10,
//       includePaths: ['.']
//     }).on('error', $.sass.logError))
//     .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
//     .pipe($.if(conf.dev, $.sourcemaps.write()))
//     .pipe(gulp.dest(conf.serve));
// });
//
// gulp.task('scripts', () => {
//   return gulp.src(conf.src + '**/*.ts', {base: 'client'})
//     .pipe($.typescript({removeComments: false, target: 'es5'}))
//     .pipe(gulp.dest(conf.serve));
// });
//
// gulp.task('server', () => {
//   return gulp.src([conf.server + "**/*"], {base: 'server'})
//     .pipe(gulp.dest(conf.distServer));
// });
//
// gulp.task('misc', () => {
//   return gulp.src([
//     conf.src + 'app/**/*.html',
//     conf.src + '/**/i18n/*.json',
//     conf.src + 'assets/**'
//   ], {base: 'client'})
//     .pipe(gulp.dest(conf.serve));
// });
//
// // inject bower components
// gulp.task('inject', ['styles', 'scripts', 'misc'], () => {
//   const injectOption = {
//     ignorePath: [conf.serve],
//     addRootSlash: false
//   };
//
//   const injectScripts = gulp.src([conf.serve + "**/*.js"])
//     .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));
//
//   gulp.src(conf.src + 'index.html')
//     .pipe($.inject(injectScripts, injectOption))
//     .pipe($.inject(gulp.src([conf.serve + "**/*.css"]), injectOption))
//     .pipe(wiredep({}))
//     .pipe(gulp.dest(conf.serve));
// });
//
// gulp.task('watch', () => {
//   gulp.watch(conf.src + '/**/*.ts', (ev) => {
//     runSequence(ev.type === 'changed' ? 'scripts' : 'inject', () => {
//       livereload.reload();
//     });
//   });
//
//   gulp.watch(conf.src + '/**/*.scss', (ev) => {
//     runSequence(ev.type === 'changed' ? 'styles' : 'inject', () => {
//       livereload.reload();
//     });
//   });
//
//   gulp.watch([
//     conf.src + '/app/**/*.html',
//     conf.src + '/app/**/*.json',
//     conf.src + '/assets/**/*',
//   ], (ev) => {
//     runSequence(ev.type === 'changed' ? 'misc' : 'inject', () => {
//       livereload.reload();
//     });
//   });
//
//   gulp.watch([conf.server + '/**/*'], ['server']);
// });
//
// gulp.task('clean', del.bind(null, [dist]));
//
// gulp.task('serve:local', () => {
//   runSequence('clean', ['inject', 'server'], 'watch', () => {
//     $.nodemon({script: conf.distServer + 'server.js', ext: 'html js', env: {'NODE_ENV': 'development'}, ignore: [conf.serve + '**/*', conf.src + "**/*"]})
//       .on('restart', function () {
//         console.log('restarted!')
//       });
//     livereload.listen();
//   });
// });