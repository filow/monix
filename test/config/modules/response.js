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
  it('404默认响应内容定制', done => {
    request(server).get('/404/default')
    .expect(404, Config.get('/', 'response/404'));
    request(server).get('/404/config')
    .expect(404, '"NotFound"', done);
  });

  it('强制路由返回值', done => {
    request(server).get('/forceStatus/normal')
    .expect(401, 'Forbidden');
    request(server).get('/forceStatus/noMatch')
    .expect(404, /默认内容/, done);
  });
});
