const assert = require('assert');
const Config = require('../../lib/config').default;
Config.regist('/', {
  number: {
    default: 1,
  },
  str: {
    default: 'foo',
  },
  array: {
    default: [],
  },
  obj: {
    default: {
      foo: 1,
    },
  },
});
Config.regist('namespace', {
  number: {
    default: 1,
  },
});
describe('Config', () => {
  it('number', () => {
    assert.equal(1, Config.get('/', 'number'));
    Config.set('/', 'number', 5);
    assert.equal(5, Config.get('/', 'number'));
  });

  it('namespace/number', () => {
    assert.equal(1, Config.get('/', 'namespace/number'));
    Config.set('/', 'namespace/number', 5);
    assert.equal(5, Config.get('/', 'namespace/number'));
  });

  it('str', () => {
    assert.equal('foo', Config.get('/', 'str'));
    Config.set('/', 'str', 'bar');
    assert.equal('bar', Config.get('/', 'str'));
  });

  it('不存在的值', () => {
    assert(typeof Config.get('/', 'foo') === 'undefined');
    Config.set('/', 'notExisted', '111');
    assert(typeof Config.get('/', 'notExisted') === 'undefined');
  });

  it('层叠覆盖测试', () => {
    Config.set('/', 'number', 1);
    Config.set('/foo', 'number', 2);
    Config.set('/bar', 'number', 3);
    Config.set('/foo/bar/baz', 'number', 9);
    assert.equal(1, Config.get('/', 'number'));
    assert.equal(2, Config.get('/foo', 'number'));
    assert.equal(3, Config.get('/bar', 'number'));
    assert.equal(3, Config.get('/bar/foo', 'number'));
    assert.equal(1, Config.get('/unexist/foo', 'number')); // 测试一个不存在的值，取得/
    assert.equal(2, Config.get('/foo/bar', 'number')); // /foo/bar没有这个值，所以就使用了上层的/foo
    assert.equal(9, Config.get('/foo/bar/baz', 'number'));
  });

  it('scope', () => {
    Config.set('/', 'str', 'foo');
    const scope = Config.scope('/foo');
    const rootScope = Config.scope();
    assert.equal('foo', rootScope.get('str'));
    assert.equal('foo', scope.get('str'));
    scope.set('str', '111');
    assert.equal('111', scope.get('str'));
  });
});
