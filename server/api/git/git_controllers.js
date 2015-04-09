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
        var paths = [];
        nodegit.Repository.open(path.resolve(repoPath, '.git')).then(function(repo) {
          return repo.index().then(function(index) {
            var flatIndex = index.entries().reduce(function(prev, entry) {
              prev.push(entry.path);
              return prev;
            }, []);

            return repo.getStatus().then(function(statuses) {
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

              flatIndex.sort(comparePaths);

              function buildTree(element, fullPath, parentNode) {
                var parts = element.split("/");
                if (parts.length == 1) {
                  // Handle file
                  parentNode.push({
                    text: parts[0],
                    href: 'file?path=' + encodeURIComponent(fullPath),
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

              flatIndex.forEach(function(element) { buildTree(element, element, paths); });

              res.send(paths);
            });
          });
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
