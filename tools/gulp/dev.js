const gulp = require('gulp')
   , livereload = require('gulp-livereload')
   , $ = require('gulp-load-plugins')()
   , q = require('q')
   , common = require('./common')
   , conf = require('./conf');

let nodemon;

conf.onServerTaskEnd = function () {
   if (nodemon) {
      nodemon.emit('restart');
   }
};

/**
 * Launch dev server and reload at each source modification
 * Dependencies: build and watch
 */
gulp.task('dev:serve', ['dev:build'], () => {
   watch();
   nodemon = $.nodemon({
      script: `${conf.paths.dev.root}/server/server.js`,
      watch: [`${conf.paths.dev.root}/server/server.js`],
      ext: 'html js',
      env: {'NODE_ENV': 'development'},
      delay: 1
   });
   nodemon.on('restart', () => conf.log.info('server restarted!'));
   livereload.listen();
});

/**
 * Build dev
 * Dependencies: clean and inject
 */
gulp.task('dev:build', () => {
   const defer = q.defer();

   common.clean([conf.paths.dev.root]);
   q.allSettled([
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
 * Inject all required elements and server
 * Dependencies: common.misc, common.langs, common.server
 */
const inject = () => {
   const defer = q.defer();
   conf.log.taskStart('inject');

   q.allSettled([
      common.misc(conf.paths.dev.client, true),
      common.langs(conf.paths.dev.client),
      common.server(conf.paths.dev.server)
   ]).then(() => {
      conf.log.taskFinnished('inject');
      defer.resolve();
   });

   return defer.promise;
};

/**
 * Watch sources files and trigger livereload
 */
const watch = () => {
   conf.log.taskStart('watch');

   // Watch client files to compile
   gulp.watch([
      `${conf.paths.client}/index.tpl`,
      `${conf.paths.client}/app/**/*.ts`,
      `${conf.paths.client}/app/**/*.css`,
      `${conf.paths.client}/app/**/*.scss`
   ], (event) => {
      watchTriggered('index');
   });

   // Watch server files
   gulp.watch([`${conf.paths.server}/**/*.ts`], () => {
      watchTriggered('server');
   });

   // Watch misc
   gulp.watch([
      `${conf.paths.client}/app/**/*.json`,
      `${conf.paths.client}/app/**/*.html`
   ], () => {
      watchTriggered('inject');
   });

   conf.log.taskFinnished('watch');
};

const states = {
   server: {
      lastTime: 0,
      running: null,
      repeat: false
   },
   inject: {
      lastTime: 0,
      running: null,
      repeat: false
   },
   index: {
      lastTime: 0,
      running: null,
      repeat: false
   }
};

const watchTriggered = (type) => {
   // Limit number of triggers to one per second per type
   if (Date.now() - states[type].lastTime < 1000) {
      return;
   }

   // If the action is currently running then we schedule the same action at the end
   if (states[type].running) {
      states[type].repeat = true;
      return;
   }

   // Run action
   runAction(type);
};

const runAction = (type) => {
   states[type].lastTime = Date.now();
   states[type].repeat = false;
   switch (type) {
      case 'server':
         states[type].running = common.server(conf.paths.dev.server);
         break;
      case 'inject':
         states[type].running = inject();
         break;
      case 'index':
         states[type].running = common.generateIndexHTML(conf.paths.dev.client, true);
         break;
   }

   states[type].running.then(() => {
      // If repeat is needed we start all over
      states[type].running = null;
      if (states[type].repeat) {
         runAction(type);
      } else if (type === 'index') {
         livereload();
      }
   });
};