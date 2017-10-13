/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

const gulp = require('gulp')
   , fs = require('fs')
   , path = require('path');

/**
 *  This will load all js the gulp directory
 *  in order to load all gulp tasks
 */
for (let file of fs.readdirSync('./tools/gulp')) {
   if (path.extname(file) === '.js') {
      require('./tools/gulp/' + file);
   }
}

/**
 *  Default task launch the main optimization build task
 */
gulp.task('default', ['dev:serve'], function () {
});
