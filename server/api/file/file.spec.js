'use strict';

var request = require("supertest-as-promised")
  , app = require('../../main/app')
  , _ = require('underscore')
  , should = require('should')
  ;

describe.skip('Rest file API:', function () {
  before(function () {
    // Clean up any old repo
    return request(app).delete('/api/git')
      .then(function (res) {
        // Clone repo for testing
        return request(app).post('/api/git/clone')
          .send({repoUrl: 'https://github.com/bleathem/codeeditor.git'})
          .expect(200);
        })
      .then(function (res) {
        res.body.length.should.be.greaterThan(2);
      });
  });

  describe('File Retrieval:', function () {
    it('retrieve a file', function () {
      return request(app).get('/api/file/gulpfile.js')
        .expect(200)
        .then(function (res) {
            var fileContents = res.body;
            fileContents.length.should.be.greaterThan(10);
            // res.body.should.be.exactly('path/to/a/file');
        });
    });
  });

  describe('File Saving:', function () {
    this.timeout(6000);

    it('Update existing file', function () {
      var fileContent = '';

      // Get current file content
      return request(app).get('/api/file/README.adoc')
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
          return request(app).get('/api/file/README.adoc')
            .expect(200);
        })
        .then(function (res) {
          // Check update worked
          res.body.should.be.exactly(fileContent);
          var updatedContent = res.body;
          updatedContent.length.should.be.greaterThan(21);
          updatedContent.should.eql(fileContent);
        });
    });

    it('Fail to update non existent file', function () {
      return request(app).put('/api/file/badFile.txt')
        .send({content: 'any content'})
        .expect(404)
        .then(function (res) {
          res.error.text.should.be.exactly('badFile.txt does not exist.');
        });
    });

    it('Create a new file', function () {
      var fileContent = 'First line of file.\nSecond line of file!';

      return request(app).post('/api/file')
        .send({filename: 'testFile.txt', content: fileContent})
        .expect(201)
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
          return fileContent;
        })
        .then(function (fileContent) {
          return request(app).get('/api/file/testFile.txt')
            .expect(200);
          })
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
        });
    });

    it('Create a new file with file in url', function () {
      var fileContent = 'First line of file.\nSecond line of file!';

      request(app).post('/api/file/anotherFile.txt')
        .send({content: fileContent})
        .expect(201)
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
          return fileContent;
        })
        .then(function (fileContent) {
          return request(app).get('/api/file/anotherFile.txt')
            .expect(200);
          })
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
        });
    });

    it('Create a new file with path', function() {
      var fileContent = 'First line of file with path.\nSecond line of file with path!';

      return request(app).post('/api/file/new/path/pathFile.txt')
        .send({content: fileContent})
        .expect(201)
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
          return fileContent;
        })
        .then(function (fileContent) {
          return request(app).get('/api/file/new/path/pathFile.txt')
            .expect(200)
          })
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
        });
    });

    it('Create a new file with path, from root', function () {
      var fileContent = 'First line of file from root.\nSecond line of file!';

      return request(app).post('/api/file')
        .send({filename: 'another/path/to/rootFile.txt', content: fileContent})
        .expect(201)
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
        })
        .then(function () {
          return request(app).get('/api/file/another/path/to/rootFile.txt')
            .expect(200);
          })
        .then(function (res) {
          res.body.should.be.exactly(fileContent);
        });
    });
  });

  after(function () {
    // Clean up repo
    return request(app).delete('/api/git');
  });
});
