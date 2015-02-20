'use strict';

var request = require('supertest')
  , app = require('../../main/app')
  , _ = require('underscore')
  ;

require('should');

describe('Rest API:', function () {
  describe('POST /api/git/clone', function () {
    this.timeout(10000);
    it('clone a repo', function (done) {
      request(app).post('/api/git/clone')
        .send({repoUrl: 'https://github.com/bleathem/visualCubeGenerator.git'})
        .expect(200)
        .end(function (err, res) {
          // console.log(res.body);
          res.body.length.should.be.greaterThan(2);
          done();
        });
    });
  });
  describe('GET /api/git/files', function () {
    it('get a file listing', function (done) {
      request(app).get('/api/git/files')
        .expect(200)
        .end(function (err, res) {
          // console.log(res.body);
          res.body.length.should.be.greaterThan(2);
          done();
        });
    });
  });
  describe('GET /api/git/file/filename', function () {
    it('retrieve a file', function (done) {
      request(app).get('/api/git/file/gulpfile.js')
        .expect(200)
        .end(function (err, res) {
          var fileContents = res.body;
          fileContents.length.should.be.greaterThan(10);
          // res.body.should.be.exactly('path/to/a/file');
          done();
        });
    });
  });
  describe('DELETE /api/git', function () {
    it('delete the clone', function (done) {
      request(app).delete('/api/git')
        .expect(200)
        .end(function (err, res) {
          res.body.exists.should.be.false;
          done();
        });
    });
  });
});
