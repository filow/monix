const request = require('supertest');
const mo = require('../../../');
const core = mo.core;

describe('Response#config', () => {
  const server = core.Server._koa.listen();
  it('404默认响应内容定制-默认返回内容', done => {
    mo.get('/404/default', res => {
      res.send(404);
    });
    request(server).get('/404/default')
    .expect(404, /定义该状态码下的默认内容/, done);
  });

  it('404默认响应内容定制-设置项内容', done => {
    mo.get('/404/config', {
      'response/404': 'NotFound',
    }, res => {
      res.send(404);
    });
    request(server).get('/404/config')
    .expect(404, '"NotFound"', done);
  });

  it('强制路由返回值-normal', done => {
    mo.get('/forceStatus/normal', {
      'response/forceStatus': 401,
    }, res => {
      res.send(401, 'Forbidden');
      res.send(200, 'Normal');
      res.send(201, 'Created');
    });
    request(server).get('/forceStatus/normal')
    .expect(401, '"Forbidden"', done);
  });

  it('强制路由返回值-nomatch', done => {
    mo.get('/forceStatus/noMatch', {
      'response/forceStatus': 404,
    }, 'normal');
    request(server).get('/forceStatus/noMatch')
    .expect(404, /默认内容/, done);
  });

  it('定制Header', done => {
    mo.set('header/X-Top-Level', 'TopLevel');
    mo.get('/headerCustomize', {
      'header/': {
        'X-Sub-Level': 'SubLevel',
      },
    }, (res) => res.ok('value', {
      header: {
        'X-Response-Level': 'ResponseLevel',
      },
    }));
    request(server).get('/headerCustomize')
    .expect('X-Top-Level', 'TopLevel')
    .expect('X-Sub-Level', 'SubLevel')
    .expect('X-Response-Level', 'ResponseLevel')
    .expect(200, '"value"', done);
  });

  it('定制输出格式-plain', done => {
    mo.get('/format/plain', { 'response/format': 'plain' }, { msg: 'ok' });
    request(server).get('/format/plain')
    .expect('Content-Type', 'text/plain')
    .expect(200, '[object Object]', done);
  });

  it('定制输出格式-html', done => {
    mo.get('/format/html', { 'response/format': 'html' }, '<html></html>');

    request(server).get('/format/html')
    .expect('Content-Type', 'text/html')
    .expect(200, '<html></html>', done);
  });
});
