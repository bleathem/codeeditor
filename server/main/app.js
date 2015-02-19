'use strict';

var express = require('express');
var app = express();
var routers = {};
var gitRouter = express.Router();
routers.gitRouter = gitRouter;

require('./config.js')(app, express, routers);

require('../api/git/git_routes.js')(gitRouter);

module.exports = exports = app;
