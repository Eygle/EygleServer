const gulp = require('gulp')
   , $ = require('gulp-load-plugins')({pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']})
   , q = require('q')
   , common = require('./common')
   , conf = require('./conf');

/**
 * Build prod
 * Dependencies: clean and inject
 */
gulp.task('prod:build', () => {
   const defer = q.defer();
   q.allSettled([
      common.clean([conf.paths.dev.root, conf.paths.distRoot]),
      common.misc(conf.paths.prod.client),
      common.langs(conf.paths.prod.client),
      common.server(conf.paths.prod.server),
      common.generateIndexHTML(conf.paths.dev.client)
   ]).then(() => {
      uglify().then(() => {
         // del.sync([`${conf.paths.dev.root}/**/*`, conf.paths.dev.root]); // Remove dev root
         defer.resolve();
      });
   });

   return defer.promise;
});

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
         module: 'eygle',
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

      const cssFilter = $.filter('**/*.css', {restore: true, dot: true});
      const jsFilter = $.filter('**/*.js', {restore: true, dot: true});
      const htmlFilter = $.filter('**/*.html', {restore: true, dot: true});

      gulp.src(`${conf.paths.dev.client}/index.html`)
         .pipe($.inject(partialsInjectFile, partialsInjectOptions))

         // Concat all css and javascript files and link then in index.html
         .pipe($.useref({base: conf.paths.dev.client, searchPath: conf.paths.dev.client}))
         // Transform javascript files: annotate, uglify and rev
         .pipe(jsFilter)
         .pipe($.ngAnnotate())
         .pipe($.uglify())
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
            maxLineLength: 120,
            removeComments: true,
            caseSensitive: true,
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
