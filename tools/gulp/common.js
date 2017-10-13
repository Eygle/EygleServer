const gulp = require('gulp')
   , merge = require('gulp-merge-json')
   , q = require('q')
   , debug = require('gulp-debug')
   , gutil = require('gulp-util')
   , del = require('del')
   , rename = require("gulp-rename")
   , wiredep = require('wiredep').stream
   , _ = require('underscore')
   , $ = require('gulp-load-plugins')()
   , livereload = require('gulp-livereload')
   , conf = require('./conf');

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
         `${dest}/app/**/*.module.css`,
         `${dest}/app/**/*.js`,
         `${dest}/interfaces/**/*.js`,
         `${dest}/common.enums.js`,
         `!${dest}/app/**/*.spec.js`,
         `!${dest}/app/**/*.mock.js`
      ]).pipe($.angularFilesort()).on('error', conf.log.error('AngularFilesort'));

      const injectOptions = {
         ignorePath: [conf.paths.client, dest],
         addRootSlash: false
      };

      gulp.src(`${conf.paths.client}/index.tpl`)
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
   const dTS = q.defer();
   const dJS = q.defer();

   gulp.src([
      `${conf.paths.client}/**/*.ts`,
      `${conf.paths.commons}/**/*.ts`,
      `!${conf.paths.client}/**/*.spec.ts`
   ])
      .pipe($.typescript({removeComments: false, target: 'es5'}))
      .pipe(gulp.dest(dest))
      .on('end', () => dTS.resolve());

   gulp.src(`${conf.paths.client}/app/**/*.js`)
      .pipe(debug({title: 'JS files injected', showFiles: false}))
      .pipe(gulp.dest(`${dest}/app`))
      .on('end', () => dJS.resolve());

   q.allSettled([dTS.promise, dJS.promise]).then(() => {
      conf.log.taskFinnished('scripts');
      if (reload) {
         livereload()
      }
      defer.resolve()
   });

   return defer.promise;
};

/**
 * Inject server files in given path
 */
exports.server = (dest) => {
   conf.log.taskStart('server');
   const defer = q.defer();
   const dTS = q.defer();
   const dMisc = q.defer();
   const dTpl = q.defer();
   const dFiles = q.defer();

   gulp.src([
	            `server/**/*.ts`,
      `${conf.paths.commons}/**/*.ts`
   ])
      .pipe($.typescript({removeComments: false, target: 'es6', module: "commonjs"}))
      .pipe(gulp.dest(dest))
      .on('end', () => dTS.resolve());

	gulp.src('server/templates/**/*')
	    .pipe(gulp.dest(`${dest}/templates`))
	    .on('end', () => dTpl.resolve());

	gulp.src('server/misc/**/*')
	    .pipe(gulp.dest(`${dest}/misc`))
	    .on('end', () => dMisc.resolve());

	gulp.src('server/files/**/*')
	    .pipe(gulp.dest(`${dest}/files`))
	    .on('end', () => dFiles.resolve());

   q.allSettled([dTS.promise, dTpl.promise, dMisc.promise]).then(() => {
      if (conf.onServerTaskEnd) conf.onServerTaskEnd();
      conf.log.taskFinnished('server');
      defer.resolve();
   });

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
      `${conf.paths.client}/app/core/scss/**/*.scss`,
      `${conf.paths.client}/app/core/**/*.scss`,
      `${conf.paths.client}/app/**/*.scss`,
      `!${conf.paths.client}/app/main/components/material-docs/demo-partials/**/*.scss`,
      `!${conf.paths.client}/app/core/scss/partials/**/*.scss`,
      `!${conf.paths.client}/app/index.scss`
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

   const res = gulp.src(`${conf.paths.client}/app/index.scss`)
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

   return defer.promise;
};

/**
 * Inject all needed files in given path
 * Excludes files types: typescript, js, sass, html, templates, languages
 */
module.exports.misc = (dest, includeHTML = false) => {
   conf.log.taskStart('misc');
   const defer = q.defer();
   const dAll = q.defer();
   const dException = q.defer();
   const dSocket = q.defer();

   gulp.src([
      `${conf.paths.client}/**/*`,
      `!${conf.paths.client}/**/*.{js,ts,scss,tpl${includeHTML ? '' : ',html'}}`,
      `!${conf.paths.client}/app/**/i18n{,/**}`,
   ], {nodir: true})
      .pipe(debug({title: 'Misc injected', showFiles: false}))
      .pipe(gulp.dest(dest))
      .on('end', () => dAll.resolve());

   gulp.src(`${conf.paths.client}/app/routingConfig.js`)
      .pipe(gulp.dest(`${dest}/app`))
      .on('end', () => dException.resolve());

   gulp.src("socket.io/**").pipe(gulp.dest(`${dest}/../socket.io`))
      .on('end', () => dSocket.resolve());

   q.allSettled([dAll.promise, dException.promise, dSocket.promise]).then(() => {
      conf.log.taskFinnished('misc');
      defer.resolve()
   });

   return defer.promise;
};

/**
 * Remove directories contents
 */
module.exports.clean = (toDel) => {
   conf.log.taskStart('clean');
   const paths = [];

   for (let d of toDel) {
      paths.push(`${d}/**/*`)
   }
   del.sync(paths);
   conf.log.taskFinnished('clean');
};

/**
 * Watch event is only a changes (not deletion or creation)
 * @param event
 * @return {boolean}
 */
exports.changeOnly = (event) => {
   return event.type === 'changed';
};
