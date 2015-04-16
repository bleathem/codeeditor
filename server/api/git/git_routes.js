'use strict';

var controller = require('./git_controllers.js')
  ;

module.exports = exports = function (router, basePath) {
  controller.setBaseRepoPath(basePath);

  router.route('/').delete(controller.deleteRepo);
  router.route('/clone').post(controller.cloneRepo);
  router.route('/files').get(controller.getFiles);
  router.route('/file/diff/:filename*').post(controller.getLineDiff);
}
