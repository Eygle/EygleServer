const gulp = require('gulp')
  , livereload = require('gulp-livereload')
  , del = require('del')
  , $ = require('gulp-load-plugins')()
  , q = require('q')
  , debug = require('gulp-debug')
  , common = require('./common')
  , conf = require('./conf');

/**
 * Launch dev server and reload at each source modification
 * Dependencies: build and watch
 */
gulp.task('dev:serve', ['dev:build'], () => {
  watch();
  $.nodemon({
    script: `${conf.paths.dev.server}/server.js`,
    ext: 'html js',
    env: {'NODE_ENV': 'development'},
    watch: conf.paths.server
  }).on('restart', () => conf.log.info('server restarted!'));
  livereload.listen();
});

/**
 * Build dev
 * Dependencies: clean and inject
 */
gulp.task('dev:build', () => {
  const defer = q.defer();

  q.allSettled([
    clean(),
    inject(),
    common.generateIndexHTML(conf.paths.dev.client)
  ]).then(() => {
    defer.resolve();
  });

  return defer.promise;
});

//////////////////////////////////////////
// DEV UTILS (privates)
//////////////////////////////////////////

/**
 * Remove dev root directory
 */
const clean = () => {
  conf.log.taskStart('clean');
  del.sync(`${conf.paths.dev.root}/**/*`);
  conf.log.taskFinnished('clean');
};

/**
 * Inject all required elements and server
 * Dependencies: common.misc, common.langs, common.server
 */
const inject = (reload = false) => {
  const defer = q.defer();
  conf.log.taskStart('inject');

  q.allSettled([
    misc(),
    common.langs(conf.paths.dev.client),
    common.server(conf.paths.dev.root)
  ]).then(() => {
    if (reload) {
      livereload.reload();
    }
    conf.log.taskFinnished('inject');
    defer.resolve();
  });

  return defer.promise;
};

/**
 * Inject all needed files in given path
 * Excludes files types: typescript, sass, templates, languages
 */
const misc = (path = null) => {
  conf.log.taskStart('misc');
  const defer = q.defer();

  gulp.src(path || [
      `${conf.paths.client}/**/*`,
      `!${conf.paths.client}/**/*.{ts,scss}`,
      `!${conf.paths.client}/app/**/i18n{,/**}`,
    ], {nodir: true}).pipe(debug({title: 'Misc injected', showFiles: false}))
    .pipe(gulp.dest(conf.paths.dev.client))
    .on('end', () => {
      conf.log.taskFinnished('misc');
      defer.resolve()
    });

  return defer.promise;
};

/**
 * Watch sources files and trigger livereload
 */
const watch = () => {
  conf.log.taskStart('watch');

  // Watch templates files
  gulp.watch([`${conf.paths.client}/index.html`, 'bower.json'], () => {
    common.generateIndexHTML(true);
  });

  // Watch styles files
  gulp.watch(`${conf.paths.client}/app/**/*.scss`, (event) => {
    if (common.changeOnly(event))
      common.styles(conf.paths.dev.client, true);
    else
      common.generateIndexHTML(true);
  });

  // Watch typescript files
  gulp.watch([`${conf.paths.client}/app/**/*.ts`], (event) => {
    if (common.changeOnly(event))
      common.scripts(conf.paths.dev.client, true);
    else
      common.generateIndexHTML(true);
  });

  gulp.watch([
    `${conf.paths.client}/app/**/*.json`,
    `${conf.paths.client}/app/**/*.html`
  ], () => {
    inject(true);
  });

  conf.log.taskFinnished('watch');
};
