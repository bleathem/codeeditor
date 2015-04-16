'use strict';

var exec = require('child_process').exec;

module.exports = function(gulp, opts) {
  gulp.task('npm-install', function (cb) {
    exec('npm install', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  });

  gulp.task('bower-install', function (cb) {
    exec('bower install', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  });
};
