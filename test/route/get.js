const request = require('supertest');
const monix = require('../../');
const api = monix.default.api;
const core = monix.default.monix;

api.get('/', res => {
  res.ok({ msg: 'ok' });
});

api.get('/string', res => {
  res.ok('ok');
});

api.get('/short_cut', {
  msg: 'ok',
});

api.get('/users/:id', res => {
  res.ok({ msg: 'ok' });
});

api.get(/\/users\/\d+/, res => {
  res.ok({ msg: 'ok' });
});

api.get('/number', res => {
  res.ok(123456);
});

api.get('/options', {}, res => {
  res.ok({ msg: 'ok' });
});

describe('route#get', () => {
  const server = core.Server.run();
  it('(/) => Object', done => {
    request(server).get('/')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
  it('(string) => Object', done => {
    request(server).get('/users/5')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
  it('(regexp) => Object', done => {
    request(server).get('/users/5')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
  it('(/short_cut) => Object', done => {
    request(server).get('/short_cut')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
  it('(/options, {}) => Object', done => {
    request(server).get('/options')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });

  it('(/string) => String', done => {
    request(server).get('/string')
    .expect('Content-Type', /html/)
    .expect(200, done);
  });

  it('(/) => Other', done => {
    request(server).get('/number')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
  it('(/) => 404', done => {
    request(server).get('/some').expect(404, done);
  });
});
