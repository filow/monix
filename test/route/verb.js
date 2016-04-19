const request = require('supertest');
const mo = require('../../');
const core = mo.core;
// 可以直接传入数据作为结果
mo.post('/router/verb', 'post');

mo.put('/router/verb', 'put');

mo.patch('/router/verb', 'patch');

mo.delete('/router/verb', 'delete');

describe('route#verb', () => {
  const server = core.Server._koa.listen();
  it('post', done => {
    request(server).post('/router/verb')
    .expect(200, '"post"', done);
  });
  it('put', done => {
    request(server).put('/router/verb')
    .expect(200, '"put"', done);
  });
  it('patch', done => {
    request(server).patch('/router/verb')
    .expect(200, '"patch"', done);
  });
  it('delete', done => {
    request(server).delete('/router/verb')
    .expect(200, '"delete"', done);
  });
});
