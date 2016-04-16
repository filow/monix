/* eslint-disable prefer-arrow-callback,func-names */
// 测试路由内部设置项的读取和设置功能
const request = require('supertest');
const assert = require('assert');
const monix = require('../../');
const api = monix.default.api;
const core = monix.default.monix;
const Config = require('../../lib/config').default;
Config.regist('test', {
  foo: 'default',
  hello: 'world',
});

api.get('/config', {
  'test/foo': '123',
}, function (res) {
  const foo = this.config.get('test/foo');
  const hello = this.config.get('test/hello');
  res.ok({
    foo,
    hello,
  });
});

api.get('/name', {
  name: 'name_route',
}, function (res) {
  res.ok(this.config.get('name'));
});

describe('Config#route#complex', () => {
  const server = core.Server.run();

  it('路由设置测试', done => {
    request(server).get('/config')
    .expect({
      foo: '123',
      hello: 'world',
    }, done);
  });

  it('具名路由', done => {
    request(server).get('/name')
    .expect('"name_route"', done);
  });

  it('重名路由自动加后缀', done => {
    api.get('/test/rename+', function (res) {
      const scope = this.config.scope;
      res.ok(scope);
    });
    api.get('/test/rename-', function (res) {
      const scope = this.config.scope;
      res.ok(scope);
    });
    api.get('/test/rename*', function (res) {
      const scope = this.config.scope;
      res.ok(scope);
    });
    request(server).get('/test/rename+')
    .expect('"get_test_rename"');
    request(server).get('/test/rename-')
    .expect('"get_test_rename_1"');
    request(server).get('/test/rename*')
    .expect('"get_test_rename_2"', done);
  });

  it('同名路由抛出异常', () => {
    function errorFn() {
      api.get('/name2', {
        name: 'name_route',
      }, {});
    }
    assert.throws(errorFn, /路由名称已存在/);
  });
});
