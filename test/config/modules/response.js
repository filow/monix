const request = require('supertest');
const monix = require('../../../');
const api = monix.api;
const core = monix.core;
const Config = core.Config;

api.get('/404/default', res => {
  res.send(404);
});

api.get('/404/config', {
  'response/404': 'NotFound',
}, res => {
  res.send(404);
});

api.get('/forceStatus/normal', {
  'response/forceStatus': 401,
}, res => {
  res.send(401, 'Forbidden');
  res.send(200, 'Normal');
  res.send(201, 'Created');
});

api.get('/forceStatus/noMatch', {
  'response/forceStatus': 404,
}, 'normal');


describe('Response#config', () => {
  const server = core.Server.run();
  it('404默认响应内容定制-默认返回内容', done => {
    request(server).get('/404/default')
    .expect(404, Config.get('/', 'response/404'), done);
  });

  it('404默认响应内容定制-设置项内容', done => {
    request(server).get('/404/config')
    .expect(404, '"NotFound"', done);
  });

  it('强制路由返回值-normal', done => {
    request(server).get('/forceStatus/normal')
    .expect(401, '"Forbidden"', done);
  });

  it('强制路由返回值-nomatch', done => {
    request(server).get('/forceStatus/noMatch')
    .expect(404, /默认内容/, done);
  });

  it('定制Header', done => {
    api.set('header/X-Top-Level', 'TopLevel');
    api.get('/headerCustomize', {
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
    api.get('/format/plain', { 'response/format': 'plain' }, { msg: 'ok' });
    request(server).get('/format/plain')
    .expect('Content-Type', 'text/plain')
    .expect(200, '[object Object]', done);
  });

  it('定制输出格式-html', done => {
    api.get('/format/html', { 'response/format': 'html' }, '<html></html>');

    request(server).get('/format/html')
    .expect('Content-Type', 'text/html')
    .expect(200, '<html></html>', done);
  });
});
