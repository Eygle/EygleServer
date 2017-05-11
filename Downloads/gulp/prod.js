const gulp = require('gulp')
  , del = require('del')
  , $ = require('gulp-load-plugins')({pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']})
  , q = require('q')
  , common = require('./common')
  , debug = require('gulp-debug')
  , conf = require('./conf');

// /**
//  * Launch prod server and reload at each source modification
//  * Dependencies: build and watch
//  */
// gulp.task('prod:serve', () => {
//   $.nodemon({
//     script: `${conf.paths.prod.root}/server.js`,
//     ext: 'html js',
//     env: {'NODE_ENV': 'production'},
//     watch: conf.paths.prod
//   }).on('restart', () => conf.log.info('server restarted!'));
// });

/**
 * Build prod
 * Dependencies: clean and inject
 */
gulp.task('prod:build', () => {
  const defer = q.defer();
  q.allSettled([
    clean(),
    inject(),
    common.generateIndexHTML(conf.paths.dev.client)
  ]).then(() => {
    uglify().then(() => {
      del.sync([`${conf.paths.dev.root}/**/*`, conf.paths.dev.root]); // Remove dev root
      defer.resolve();
    });
  });

  return defer.promise;
});

//////////////////////////////////////////
// Prod UTILS (privates)
//////////////////////////////////////////

/**
 * Remove dev root directory
 */
const clean = () => {
  conf.log.taskStart('clean');
  del.sync([`${conf.paths.dev.root}/**/*`, `${conf.paths.prod.root}/**/*`]);
  conf.log.taskFinnished('clean');
};

/**
 * Inject all required elements and server
 * Dependencies: common.misc, common.langs, common.server
 */
const inject = () => {
  const defer = q.defer();
  conf.log.taskStart('inject');

  q.allSettled([
    misc(),
    common.langs(conf.paths.prod.client),
    common.server(conf.paths.prod.root)
  ]).then(() => {
    conf.log.taskFinnished('inject');
    defer.resolve();
  });

  return defer.promise;
};


/**
 * Inject all needed files in given path
 * Excludes files types: typescript, js, sass, html, templates, languages
 */
const misc = () => {
  conf.log.taskStart('misc');
  const defer = q.defer();

  gulp.src([
    `${conf.paths.client}/**/*`,
    `!${conf.paths.client}/**/*.{ts,scss,html}`,
    `!${conf.paths.client}/app/**/i18n{,/**}`,
  ], {nodir: true}).pipe(debug({title: 'Misc injected', showFiles: false}))
    .pipe(gulp.dest(conf.paths.prod.client))
    .on('end', () => {
      conf.log.taskFinnished('misc');
      defer.resolve()
    });

  return defer.promise;
};

/**
 * Minify all html and store them in partials folder
 */
const partials = () => {
  conf.log.taskStart('partials');
  const defer = q.defer();

  gulp.src(`${conf.paths.client}/app/**/*.html`)
    .pipe($.htmlmin({
      collapseWhitespace: true,
      maxLineLength: 120,
      removeComments: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'mapui',
      root: 'app'
    }))
    .pipe(gulp.dest(`${conf.paths.dev.client}/partials/`))
    .on('end', () => {
      conf.log.taskFinnished('partials');
      defer.resolve();
    });

  return defer.promise;
};

/**
 * Uglify and merge html, css and javascripts files
 */
const uglify = () => {
  const defer = q.defer();

  partials().then(() => {
    conf.log.taskStart('uglify');
    const partialsInjectFile = gulp.src(`${conf.paths.dev.client}/partials/templateCacheHtml.js`, {read: false});
    const partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: `${conf.paths.dev.client}/`,
      addRootSlash: false
    };

    const cssFilter = $.filter(`**/*.css`, {restore: true});
    const jsFilter = $.filter(`**/*.js`, {restore: true});
    const htmlFilter = $.filter(`index.html`, {restore: true});

    gulp.src(`${conf.paths.dev.client}/index.html`)
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))

      // Concat all css and javascript files and link then in index.html
      .pipe($.useref({base: conf.paths.dev.client, searchPath: conf.paths.dev.client}))

      // Transform javascript files: annotate, uglify and rev
      .pipe(jsFilter)
      .pipe($.ngAnnotate())
      .pipe($.uglify({preserveComments: $.uglifySaveLicense})).on('error', conf.log.error('Uglify'))
      .pipe($.rev())
      .pipe(jsFilter.restore)

      // Transform css files: clean and rev
      .pipe(cssFilter)
      .pipe($.cleanCss())
      .pipe($.rev())
      .pipe(cssFilter.restore)

      .pipe($.revReplace()) //Rewrite occurrences of filenames which have been renamed by gulp-rev

      // Minify index.html
      .pipe(htmlFilter)
      .pipe($.htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true
      }))
      .pipe(htmlFilter.restore)

      // Destination file index.html
      .pipe(gulp.dest(`${conf.paths.prod.client}/`))
      .on('end', () => {
        conf.log.taskFinnished('uglify');
        defer.resolve();
      })

      // Display files sizes
      .pipe($.size({
        title: `${conf.paths.prod.client}/`,
        showFiles: true
      }));
  });

  return defer.promise;
};
