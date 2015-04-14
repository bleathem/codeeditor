'use strict';

var express = require('express');
var os = require('os');
var app = express();
var routers = {};
var basePath = os.tmpdir() + '/clones';
var gitRouter = express.Router();
routers.gitRouter = gitRouter;

require('./config.js')(app, express, routers);
require('../api/git/git_routes.js')(gitRouter, basePath);

module.exports = exports = app;
