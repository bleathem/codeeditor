'use strict';

var path = require('path')
  , fs = require('fs.extra')
  , q = require('q')
  ;

function writeFile(filename, content) {
  var deferred = q.defer();

  fs.writeFile(filename, content, function (err) {
    if (err) deferred.reject(err);

    fs.readFile(filename, function (err, data) {
      if (err) deferred.reject(err);

      deferred.resolve(data.toString());
    });
  });

  return deferred.promise;
}

function save(filename, content, shouldExist, res, next) {
  fs.exists(baseRepoPath, function(exists) {
    if (exists) {
      var filePath = path.resolve(baseRepoPath, filename);
      fs.exists(filePath, function(exists) {
        if ((exists && shouldExist) || (!exists && !shouldExist)) {
          // Create/Update file
          writeFile(filePath, content)
            .then(function(data) {
              if (!shouldExist) res.status(201);

              res.json(data.toString());
            })
            .catch(function (err) {
               throw err;
            })
            .done();
        } else {
          if (shouldExist) {
            // File not found
            res.status(404).send(filename + ' does not exist.');
          } else {
            // Trying to create file that already exists
            res.status(409).send(filename + ' already exists.');
          }
        }
      });
    } else {
      next('Clone a repo first');
    }
  });
}

var baseRepoPath = '';

module.exports = exports = {
  setBaseRepoPath: function(basePath) {
    baseRepoPath = basePath;
  },

  updateFile: function(req, res, next) {
    save(req.params.filename + req.params[0], req.body.content, true, res, next);
  },

  createFile: function(req, res, next) {
    var filename;

    if (req.params && req.params.filename) {
      filename = req.params.filename + req.params[0];
    } else {
      filename = req.body.filename;
    }

    if (filename.indexOf(path.sep) > 0) {
      // Check directory
      var directory = path.resolve(baseRepoPath, filename.substring(0, filename.lastIndexOf(path.sep)));
      fs.exists(directory, function (exists) {
        if (!exists) {
          fs.mkdirp(directory, function (err) {
            if (err) throw err;

            save(filename, req.body.content, false, res, next);
          });
        } else {
          save(filename, req.body.content, false, res, next);
        }
      });
    } else {
      save(filename, req.body.content, false, res, next);
    }

  }
};