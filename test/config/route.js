/* eslint-disable prefer-arrow-callback,func-names */
// 测试路由内部设置项的读取和设置功能
const request = require('supertest');
const monix = require('../../');
const api = monix.default.api;
const core = monix.default.monix;
const Config = require('../../lib/config').default;
Config.regist('test', {
  foo: {
    default: 'default',
  },
  hello: {
    default: 'world',
  },
});

api.get('/config', {
  'test/foo': '123',
  'test/bar': {
    baz: 456,
  },
}, function (res) {
  const foo = this.config.get('test/foo');
  const bar = this.config.get('test/bar');
  const hello = this.config.get('test/hello');
  res.ok({
    foo,
    bar,
    hello,
  });
});

describe('route#complex', () => {
  const server = core.Server.run();

  it('路由设置测试', done => {
    request(server).get('/config')
    .expect({
      foo: '123',
      // 没有bar因为这个值没有注册过
      hello: 'world',
    }, done);
  });
});
