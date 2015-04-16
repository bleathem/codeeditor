'use strict';

var request = require("supertest-as-promised")
  , app = require('../../main/app')
  , _ = require('underscore')
  , should = require('should')
  ;

describe('Rest file API:', function () {
  before(function (done) {
    // Clean up any old repo
    request(app).delete('/api/git')
      .then(function (res) {
        // Clone repo for testing
        request(app).post('/api/git/clone')
          .send({repoUrl: 'https://github.com/bleathem/codeeditor.git'})
          .expect(200)
          .end(function (err, res) {
            res.body.length.should.be.greaterThan(2);
            done();
          });
      })
      .catch(function (err) {
        done(err);
      });
  });

  describe('File Saving:', function () {
    this.timeout(6000);

    it('Update existing file', function (done) {
      var fileContent = '';

      // Get current file content
      request(app).get('/api/git/file/README.adoc')
        .expect(200)
        .then(function (res) {
          fileContent = res.body;
          fileContent.length.should.be.greaterThan(20);
          return fileContent;
        })
        .then(function (fileData) {
          // Update file content
          fileContent = "First line of file\n" + fileData;
          return fileContent;
        })
        .then(function (fileData) {
          // Update file
          return request(app).put('/api/file/README.adoc')
            .send({content: fileData});
        })
        .then(function (res) {
          res.status.should.be.equal(200);
        })
        .then(function () {
          return request(app).get('/api/git/file/README.adoc')
            .expect(200);
        })
        .then(function (res) {
          // Check update worked
          res.body.should.be.exactly(fileContent);
          var updatedContent = res.body;
          updatedContent.length.should.be.greaterThan(21);
          updatedContent.should.eql(fileContent);
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('Fail to update non existent file', function (done) {
      request(app).put('/api/file/badFile.txt')
        .send({content: 'any content'})
        .expect(404)
        .then(function (res) {
          res.error.text.should.be.exactly('badFile.txt does not exist.');
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('Create a new file', function (done) {
      var fileContent = 'First line of file.\nSecond line of file!';

      request(app).post('/api/file')
        .send({filename: 'testFile.txt', content: fileContent})
        .expect(201)
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
          return fileContent;
        })
        .then(function (fileContent) {
          request(app).get('/api/git/file/testFile.txt')
            .expect(200)
            .then(function (res) {
              res.body.should.be.exactly(fileContent);
              done();
            })
            .catch(function (err) {
              done(err);
            });
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('Create a new file with file in url', function (done) {
      var fileContent = 'First line of file.\nSecond line of file!';

      request(app).post('/api/file/anotherFile.txt')
        .send({content: fileContent})
        .expect(201)
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
          return fileContent;
        })
        .then(function (fileContent) {
          request(app).get('/api/git/file/anotherFile.txt')
            .expect(200)
            .then(function (res) {
              res.body.should.be.exactly(fileContent);
              done();
            })
            .catch(function (err) {
              done(err);
            });
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('Create a new file with path', function(done) {
      var fileContent = 'First line of file with path.\nSecond line of file with path!';

      request(app).post('/api/file/new/path/pathFile.txt')
        .send({content: fileContent})
        .expect(201)
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
          return fileContent;
        })
        .then(function (fileContent) {
          request(app).get('/api/git/file/new/path/pathFile.txt')
            .expect(200)
            .then(function (res) {
              res.body.should.be.exactly(fileContent);
              done();
            })
            .catch(function (err) {
              done(err);
            });
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('Create a new file with path, from root', function (done) {
      var fileContent = 'First line of file from root.\nSecond line of file!';

      request(app).post('/api/file')
        .send({filename: 'another/path/to/rootFile.txt', content: fileContent})
        .expect(201)
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
        })
        .then(function () {
          request(app).get('/api/git/file/another/path/to/rootFile.txt')
            .expect(200)
            .then(function (res) {
              res.body.should.be.exactly(fileContent);
              done();
            })
            .catch(function (err) {
              done(err);
            });
        })
        .catch(function (err) {
          done(err);
        });
    });
  });

  after(function (done) {
    // Clean up repo
    request(app).delete('/api/git')
      .then(function (res) {
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });
});
