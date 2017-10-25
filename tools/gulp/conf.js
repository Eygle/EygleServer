/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

const gutil = require('gulp-util')
   , gulp = require('gulp');

const devRoot = '.tmp'
   , distRoot = '.dist'
	, prodRoot = distRoot;


/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
	client: 'client',
   server: 'server',
   commons: 'commons',

   distRoot: distRoot,

   dev: {
      root: devRoot,
      client: `${devRoot}/client`,
      server: `${devRoot}/server`
   },

   prod: {
      root: prodRoot,
      client: `${prodRoot}/client`,
      server: `${prodRoot}/server`
   },

   tests: {
      e2e: 'tests'
   }
};

/**
 * Gulp logger wrapper
 */
exports.log = {
   info: (str) => {
      gutil.log(str);
   },

   taskStart: (name) => {
      gutil.log(`Starting ${gutil.colors.grey('private')} '${gutil.colors.cyan(name)}'...`);
      tasksTimes[name] = Date.now()
   },

   taskFinnished: (name) => {
      gutil.log(`Finished ${gutil.colors.grey('private')} '${gutil.colors.cyan(name)}' after ${gutil.colors.magenta(formatTaskDuration(name))}`);
      delete tasksTimes[name];
   },

   /**
    *  Common implementation for an error handler of a Gulp plugin
    */
   error: (title) => {
      return (err) => {
         gutil.log(gutil.colors.red(`[${title}]`), err.toString(), err);
         gulp.emit('end');
      };
   }
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
   directory: 'bower_components'
};

exports.onServerTaskEnd = null;

const tasksTimes = {};

const formatTaskDuration = (task) => {
   const time = tasksTimes[task];
   if (!time) {
      return `no task ${task} started`;
   }
   const diff = Date.now() - time;

   if (diff > 1000) {
      const sec = diff / 1000;
      return `${sec >= 10 ? Math.round(sec) : sec} s`;
   }
   return `${diff} ms`;
};
