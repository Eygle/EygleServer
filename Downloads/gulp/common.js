const gulp = require('gulp')
  , merge = require('gulp-merge-json')
  , livereload = require('gulp-livereload')
  , q = require('q')
  , debug = require('gulp-debug')
  , gutil = require('gulp-util')
  , rename = require("gulp-rename")
  , wiredep = require('wiredep').stream
  , _ = require('underscore')
  , $ = require('gulp-load-plugins')()
  , conf = require('./conf');

/**
 * Inject server files in given dist
 */
exports.server = (dist, file = null) => {
  conf.log.taskStart('server');
  const defer = q.defer();
  const dAll = q.defer();
  const dServer = q.defer();
  const dSocket = q.defer();

  const path = file ? `${dist}/${file.substr(0, file.lastIndexOf('/'))}` : null;

  gulp.src(file || "server/**")
    .pipe(debug({title: 'Server injected', showFiles: false}))
    .pipe(gulp.dest(path || `${dist}/server`)).on('end', () => dServer.resolve());

  if (!file) {
    gulp.src([
      "server.js",
      "bower.json",
      "package.json"
    ])
      .pipe(gulp.dest(dist))
      .on('end', () => dAll.resolve());

    gulp.src("socket.io/**").pipe(gulp.dest(`${dist}/socket.io`)).on('end', () => dSocket.resolve());

    q.allSettled([dAll.promise, dServer.promise, dSocket.promise]).then(() => {
      conf.log.taskFinnished('server');
      defer.resolve();
    });
  } else {
    dServer.promise.then(() => {
      conf.log.taskFinnished('server');
      defer.resolve();
    })
  }

  return defer.promise;
};

/**
 * Merge and inject all languages files in a single file per language
 */
exports.langs = (dest) => {
  conf.log.taskStart('langs');
  const defer = q.defer();
  const promises = [];
  const langs = ['fr', 'en'];

  for (let l of langs) {
    const d = q.defer();
    promises.push(d.promise);
    gulp.src(`${conf.paths.client}/app/**/i18n/${l}.json`)
      .pipe(debug({title: `Lang ${gutil.colors.cyan(l)} merged`, showFiles: false}))
      .pipe(merge({
        fileName: `${l}.json`,
        jsonSpace: ''
      }))
      .pipe(gulp.dest(`${dest}/app/i18n`))
      .on('end', () => d.resolve());
  }

  q.allSettled(promises).then(() => {
    conf.log.taskFinnished('langs');
    defer.resolve();
  });

  return defer.promise;
};

/**
 * Use Wiredep to inject all required files in index.html in correct order
 * Dependencies: scripts, styles
 */
exports.generateIndexHTML = (dest, reload = false) => {
  const defer = q.defer();

  q.allSettled([
    exports.scripts(dest),
    exports.styles(dest),
  ]).then(() => {
    conf.log.taskStart('generate index.html');

    const injectStyles = gulp.src([
      `${dest}/app/**/*.css`,
      `!${dest}/app/vendor.css`
    ], {read: false});

    const injectScripts = gulp.src([
      `${dest}/app/**/*.js`,
    ]).pipe($.angularFilesort()).on('error', conf.log.error('AngularFilesort'));

    const injectOptions = {
      ignorePath: [conf.paths.client, dest],
      addRootSlash: false
    };

    gulp.src(`${conf.paths.client}/index.html`)
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(_.extend({}, conf.wiredep)))
      .pipe(rename(function (path) {
        path.extname = '.html'
      }))
      .pipe(gulp.dest(dest))
      .on('end', () => {
        if (reload) {
          conf.log.info("Reload because index.html changed");
          livereload.reload()
        }
        conf.log.taskFinnished('generate index.html');
        defer.resolve();
      });
  });

  return defer.promise;
};

/**
 * Transpile all typescripts files into javascript files
 * Copy all raw clients javascripts files into 'dest' folder
 */
exports.scripts = (dest, reload = false) => {
  conf.log.taskStart('scripts');
  const defer = q.defer();

  const res = gulp.src(`${conf.paths.client}/**/*.ts`)
    .pipe($.typescript({removeComments: false, target: 'es5'}))
    .pipe(gulp.dest(dest))
    .on('end', () => {
      conf.log.taskFinnished('scripts');
      defer.resolve()
    });

  if (reload) {
    res.pipe(livereload());
  }

  return defer.promise;
};

/**
 * Transpiling all sass files into a single 'index.css' file with source map
 */
exports.styles = (dest, reload = false) => {
  conf.log.taskStart('styles');
  const defer = q.defer();
  const sassOptions = {
    style: 'expanded'
  };

  const injectFiles = gulp.src([
    `${conf.paths.client}/app/core/common.scss`,
    `${conf.paths.client}/app/**/*.scss`,
    `!${conf.paths.client}/app/app.scss`
  ], {read: false});

  const injectOptions = {
    transform: function (filePath) {
      filePath = filePath.replace(`${conf.paths.client}/app/`, '');
      return `@import "${filePath}";`;
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  const res = gulp.src(`${conf.paths.client}/app/app.scss`)
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', conf.log.error('Sass'))
    .pipe($.autoprefixer()).on('error', conf.log.error('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(`${dest}/app/`))
    .on('end', () => {
      conf.log.taskFinnished('styles');
      defer.resolve()
    });

  if (reload) {
    res.pipe(livereload());
  }

  res.pipe($.size({title: `${dest}/`, showFiles: true}));

  return defer.promise;
};

/**
 * Watch event is only a changes (not deletion or creation)
 * @param event
 * @return {boolean}
 */
exports.changeOnly = (event) => {
  return event.type === 'changed';
};
