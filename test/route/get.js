const request = require('supertest');
const mo = require('../../');
const core = mo.core;
const commonResponse = { msg: 'ok' };
// 可以直接传入数据作为结果
mo.get('/', commonResponse);

mo.get('/string', 'ok');

mo.get('/short_cut', commonResponse);

mo.get('/users/:id', commonResponse);

mo.get(/\/users\/\d+/, commonResponse);

mo.get('/number', 123456);
// 也可以利用一个函数的返回值作为结果
mo.get('/options', {}, () => commonResponse);

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
