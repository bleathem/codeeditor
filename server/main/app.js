'use strict';

var express = require('express');
var os = require('os');
var app = express();
var routers = {};
var basePath = os.tmpdir() + '/clones';
var gitRouter = express.Router();
var fileRouter = express.Router();
routers.gitRouter = gitRouter;
routers.fileRouter = fileRouter;

require('./config.js')(app, express, routers);
require('../api/git/git_routes.js')(gitRouter, basePath);
require('../api/file/file_routes.js')(fileRouter, basePath);

module.exports = exports = app;
