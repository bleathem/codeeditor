'use strict';

var controller = require('./file_controllers.js')
  ;

module.exports = exports = function (router, basePath) {
  controller.setBaseRepoPath(basePath);

  router.route('/').post(controller.createFile);
  router.route('/:filename*').get(controller.getFile);
  router.route('/:filename*').post(controller.createFile);
  router.route('/:filename*').put(controller.updateFile);
};
