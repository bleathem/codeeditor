'use strict';

var nodegit = require('nodegit')
  , path = require('path')
  , os = require('os')
  , rimraf = require('rimraf')
  , fs = require('fs')
  , gitutils = require('git-utils')
  ;

function cloneOrOpenRepo(url, repoPath) {
  var opts = { ignoreCertErrors: 1 };
  return nodegit.Clone.clone(url, repoPath, opts).then(function(repo) {
    return repo;
  }, function (err) {
    console.log(err);
    return nodegit.Repository.open(path.resolve(repoPath, '.git')).then(function(repo) {
      return repo;
    });
  });
}

function comparePaths(a, b) {
  var aSlash = a.indexOf('/');
  var bSlash = b.indexOf('/');

  if (aSlash > 0) {
    // a has a directory path
    if (bSlash > 0) {
      // b has a directory path
      var firstComp = a.substring(0, aSlash).localeCompare(b.substring(0, bSlash));
      if (firstComp == 0) {
        // First directory path is equal
        return comparePaths(a.substring(aSlash + 1), b.substring(bSlash + 1));
      } else {
        // Unequal first directory path
        return firstComp;
      }
    } else {
      return -1;
    }
  } else {
    // a is a file
    if (bSlash > 0) {
      // b has a directory path
      return 1;
    } else {
      // b is a file
      return a.localeCompare(b);
    }
  }
}

function buildTree(element, fullPath, parentNode) {
  var parts = element.split("/");
  if (parts.length == 1) {
    // Handle file
    parentNode.push({
      text: parts[0],
      href: 'project/file?path=' + encodeURIComponent(fullPath),
      icon: 'fa fa-file-o'
    });
  } else {
    // Handle directory
    var childNode = parentNode;
    for (var i=0; i < parentNode.length; i++) {
      if (parentNode[i].text == parts[0]) {
        childNode = parentNode[i];
        break;
      }
    }

    // Need to create child node
    if (childNode == parentNode) {
      childNode = {
        text: parts[0],
        nodes: []
      };
      parentNode.push(childNode);
    }

    buildTree(element.substring(parts[0].length + 1), fullPath, childNode.nodes);
  }
}

function getFileTree(repo) {
  var flatIndex;
  return repo.index()
    .then(function(index) {
      flatIndex = index.entries().reduce(function(prev, entry) {
        prev.push(entry.path);
        return prev;
      }, []);
      return flatIndex;
    })
    .then(function(flatIndex) {
      return repo.getStatus();
    })
    .then(function(statuses) {
      statuses.forEach(function(status) {
        if (status.isNew()) {
          if (!flatIndex.some(function(element) { return element == status.path() })) {
            flatIndex.push(status.path());
          }
        } else if (status.isDeleted()) {
          flatIndex = flatIndex.filter(function(element) {
            if (element == status.path()) {
              return false;
            }
            return true;
          });
        }
      });      
      flatIndex.sort(comparePaths);
      var paths = [];
      flatIndex.forEach(function(element) { buildTree(element, element, paths); });

      return paths;
    });
}

var repoPath = os.tmpdir() + '/clones';

module.exports = exports = {
  cloneRepo: function(req, res, next) {
    var url = req.body.repoUrl;
    cloneOrOpenRepo(url, repoPath)
      .then(getFileTree)
      .then(function(paths) {
        res.send(paths)
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
        nodegit.Repository.open(path.resolve(repoPath, '.git'))
          .then(getFileTree)
          .then(function(paths) {
            res.send(paths)
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
        fs.readFile(path.resolve(repoPath, filename), function(err, data) {
          if (err) throw err;

          res.json(data.toString());
        });
      } else {
        next('Clone a repo first');
      }
    });
  },

  getLineDiff: function(req, res, next) {
    fs.exists(repoPath, function(exists) {
      if (exists) {
        var repository = gitutils.open(repoPath)
          , path = req.params.filename + req.params[0]
          , text = req.body.text;
        var diffs = repository.getLineDiffs(path, text);
        res.json(diffs);
      } else {
        next('Clone a repo first');
      }
    });
  }
}
