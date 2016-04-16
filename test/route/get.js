const request = require('supertest');
const monix = require('../../');
const api = monix.api;
const core = monix.core;
const commonResponse = { msg: 'ok' };
api.get('/', res => {
  res.ok(commonResponse);
});

api.get('/string', res => {
  res.ok('ok');
});

api.get('/short_cut', commonResponse);

api.get('/users/:id', res => {
  res.ok(commonResponse);
});

api.get(/\/users\/\d+/, res => {
  res.ok(commonResponse);
});

api.get('/number', res => {
  res.ok(123456);
});

api.get('/options', {}, res => {
  res.ok(commonResponse);
});

describe('route#get', () => {
  const server = core.Server.run();
  it('(/) => Object', done => {
    request(server).get('/')
    .expect(200, commonResponse, done);
  });
  it('(string) => Object', done => {
    request(server).get('/users/5')
    .expect(200, commonResponse, done);
  });
  it('(regexp) => Object', done => {
    request(server).get('/users/5')
    .expect(200, commonResponse, done);
  });
  it('(/short_cut) => Object', done => {
    request(server).get('/short_cut')
    .expect(200, commonResponse, done);
  });
  it('(/options, {}) => Object', done => {
    request(server).get('/options')
    .expect(200, commonResponse, done);
  });

  it('(/string) => String', done => {
    request(server).get('/string')
    .expect(200, '"ok"', done);
  });

  it('(/) => Other', done => {
    request(server).get('/number')
    .expect(200, '123456', done);
  });
  it('(/) => 404', done => {
    request(server).get('/some').expect(404, done);
  });
});
