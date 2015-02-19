'use strict';

var _ = require('underscore')
  ;

var opts = {
  paths: {}
, lrPort: 35729
, frontend: {
    hostname: 'localhost'
  , port: '9000'
  }
};

module.exports = function(gulp, baseOpts) {
  var newOpts = _.extend({}, baseOpts, opts);
  return newOpts;
};
