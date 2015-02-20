'use strict';

var nodegit = require('nodegit')
  , path = require('path')
  , os = require('os')
  , rimraf = require('rimraf')
  , fs = require('fs')
  ;

function cloneOrOpenRepo(url, repoPath) {
  return nodegit.Clone.clone(url, repoPath).then(function(repo) {
    return repo;
  }, function (err) {
    console.log(err);
    return nodegit.Repository.open(path.resolve(repoPath, '.git')).then(function(repo) {
      return repo;
    });
  });
};

var repoPath = os.tmpdir() + '/clones';

module.exports = exports = {
  cloneRepo: function(req, res, next) {
    var url = req.body.repoUrl;
    var paths = [];
    cloneOrOpenRepo(url, repoPath).then(function(repo) {
      return repo.getMasterCommit();
    })
    .then(function(firstCommitOnMaster) {
      return firstCommitOnMaster.getTree();
    })
    .then(function(tree) {
      // `walk()` returns an event.
      var walker = tree.walk();
      walker.on('entry', function(entry) {
        var path = entry.path();
        // console.log(path);
        paths.push(path)
      });
      walker.on('tree', function(entry) {
        var path = entry.path();
        // console.log(path);
        paths.push(path)
      });
      walker.on('end', function(entries) {
        res.send(paths);
      });
      walker.start();
    })
    .done()
  },

  deleteRepo: function(req, res, next) {
    rimraf(repoPath, function() {
      fs.exists(repoPath, function(exists) {
        console.log('exists', exists);
        res.send({exists: exists});
      });
    });
  },

  getFiles: function(req, res, next) {
    fs.exists(repoPath, function(exists) {
      if (exists) {
        var filename = req.params.filename + req.params[0];
        var paths = [];
        nodegit.Repository.open(path.resolve(repoPath, '.git')).then(function(repo) {
          return repo.getMasterCommit();
        })
        .then(function(commit) {
          return commit.getTree();
        })
        .then(function(tree) {
          // `walk()` returns an event.
          var walker = tree.walk();
          walker.on('entry', function(entry) {
            var path = entry.path();
            // console.log(path);
            paths.push(path)
          });
          walker.on('tree', function(entry) {
            var path = entry.path();
            // console.log(path);
            paths.push(path)
          });
          walker.on('end', function(entries) {
            res.send(paths);
          });
          walker.start();
        })
        .done()
      } else {
        next('Clone a repo first');
      }
    });
  },

  getFile: function(req, res, next) {
    fs.exists(repoPath, function(exists) {
      if (exists) {
        var filename = req.params.filename + req.params[0];
        nodegit.Repository.open(path.resolve(repoPath, '.git')).then(function(repo) {
          return repo.getMasterCommit();
        })
        .then(function(commit) {
          return commit.getEntry(filename);
        })
        .then(function(entry) {
          var _entry = entry;
          return _entry.getBlob();
        })
        .then(function(blob) {
          res.json(blob.toString());
        })
        .done();
      } else {
        next('Clone a repo first');
      }
    });
  }
}
