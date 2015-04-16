'use strict';

var request = require('supertest-as-promised')
  , app = require('../../main/app')
  , _ = require('underscore')
  ;

require('should');

describe('Rest git API:', function () {
  describe('POST /api/git/clone', function () {
    this.timeout(10000);
    it('clone a repo', function () {
      return request(app).post('/api/git/clone')
        .send({repoUrl: 'https://github.com/bleathem/codeeditor.git'})
        .expect(200)
        .then(function (res) {
          // console.log(res.body);
          res.body.length.should.be.greaterThan(2);
        });
    });
  });
  describe('GET /api/git/files', function () {
    it('get a file listing', function () {
      return request(app).get('/api/git/files')
        .expect(200)
        .then(function (res) {
          // console.log(res.body);
          res.body.length.should.be.greaterThan(2);
        });
    });
  });
  describe('POST /api/git/file/diff/:filename', function () {
    it('diff a file', function () {
      return request(app).post('/api/git/file/diff/gulpfile.js')
        .send({text: ''})
        .expect(200)
        .then(function (res) {
          // console.log('*****\n', res.body, '\n*****');
          var diffs = res.body;
          diffs.length.should.equal(1);
          diffs[0].oldStart.should.equal(1);
          diffs[0].oldLines.should.be.greaterThan(2);
          diffs[0].newStart.should.equal(0);
          diffs[0].newLines.should.equal(0);
        });
    });
  });
  describe('Files Diff:', function () {
    this.timeout(6000);

    it('Return the diff after modifying a file', function () {
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
          fileContent = 'First line of file\n' + fileData;
          return fileContent;
        })
        .then(function (fileData) {
          // Update file
          return request(app).put('/api/file/README.adoc')
            .send({content: fileData});
        })
        .then(function (res) {
          // check the index status
          return request(app).get('/api/git/status')
            .expect(200);
        })
        .then(function (res) {
          var statuses = res.body;
          statuses.should.have.length(1);
          statuses[0].path.should.equal('README.adoc')
          statuses[0].new.should.equal(0);
          statuses[0].modified.should.be.greaterThan(1);
        })
        .then(function () {
          // check the file diff
          return request(app).get('/api/git/files/diff')
            .expect(200);
        })
        .then(function (res) {
          var patches = res.body;
          patches.should.have.length(1);
          var patch = patches[0];
          patch.newFile.should.equal('README.adoc');
          patch.oldFile.should.equal('README.adoc');
          patch.hunks.should.have.length(1);
          var hunk = patch.hunks[0];
          hunk.lines[0].origin.should.equal('+');
          hunk.lines[0].content.should.equal('First line of file');
          // console.log(hunk);
        });
    });
  });
  describe('DELETE /api/git', function () {
    it('delete the clone', function () {
      return request(app).delete('/api/git')
        .expect(200)
        .then(function (res) {
          res.body.exists.should.be.false;
        });
    });
  });
});
