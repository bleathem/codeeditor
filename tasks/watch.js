'use strict';

var livereload    = require('gulp-livereload')
  , gutil         = require('gulp-util')
  ;

module.exports = function(gulp, opts) {
  gulp.task('livereload-start', function () {
    opts.watching = true;
    opts.lr = livereload.listen(opts.lrPort, {silent: false, auto:true});
    gutil.log('Livereload tiny-lr started listeining on port:' + opts.lr.port);
  });
};
