'use strict';

var request = require('supertest')
  , app = require('../../main/app')
  , _ = require('underscore')
  ;

require('should');

describe('Rest API:', function () {
  describe('GET /api/git/clone', function () {
    this.timeout(30000);
    it('clone a repo', function (done) {
      request(app).post('/api/git/clone?repo_url=test')
        .send({repoUrl: 'https://github.com/bleathem/visualCubeGenerator.git'})
        .expect(200)
        .end(function (err, res) {
          // console.log(res.body);
          res.body.length.should.be.greaterThan(2);
          done();
        });
    });
  });
});
