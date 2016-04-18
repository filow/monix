const assert = require('assert');
const monix = require('../../');
const Config = monix.core.Config;
Config.registDynamic('dynamic', /^\d+$/, {
  default: 100,
  validators: [Config.v.type('number')],
}, (key) => key !== '123');

Config.registDynamic('dynamic', /str\.\w+/, {
  default: 'testVal',
  validators: [Config.v.type('string')],
});

Config.registDynamic('dynamic', ['ok1', 'ok2'], 'testVal');

describe('动态设置项', () => {
  const scope = Config.scope('/');
  it('动态注册数字', () => {
    // 正常情况
    assert(typeof scope.get('dynamic/100') === 'undefined');
    scope.set('dynamic/100', 500);
    assert.equal(500, scope.get('dynamic/100'));
    // 123是一个被禁止使用的项目
    assert(typeof scope.get('dynamic/123') === 'undefined');
    scope.set('dynamic/123', 500);
    assert(typeof scope.get('dynamic/123') === 'undefined');
  });

  it('动态注册字符串', () => {
    assert(typeof scope.get('dynamic/str.normal') === 'undefined');
    scope.set('dynamic/str.normal', 'normal');
    assert.equal('normal', scope.get('dynamic/str.normal'));
  });

  it('数组规则', () => {
    assert(typeof scope.get('dynamic/ok1') === 'undefined');
    scope.set('dynamic/ok1', 'ok1');
    assert.equal('ok1', scope.get('dynamic/ok1'));
    // 不存在于数组内的值无效
    assert(typeof scope.get('dynamic/ok3') === 'undefined');
    scope.set('dynamic/ok3', 'ok3');
    assert(typeof scope.get('dynamic/ok3') === 'undefined');
  });

  it('不符合规则的类型', () => {
    assert(typeof scope.get('dynamic/foo') === 'undefined');
    scope.set('dynamic/foo', 'foo');
    assert(typeof scope.get('dynamic/foo') === 'undefined');
  });

  it('不能在根域上注册动态属性', () => {
    function errorFn() {
      Config.registDynamic('/', /str\.\w+/, 'testVal');
    }
    assert.throws(errorFn, /不能在根域上注册/);
  });

  it('不合法的命名空间', () => {
    function errorFn() {
      Config.registDynamic('_foo', /\w+/, 'testVal');
    }
    assert.throws(errorFn, '注册动态属性时，命名空间只能由字母、数字和.组成');
  });

  it('rule只能为数组或正则表达式', () => {
    function errorFn() {
      Config.registDynamic('object', {}, 'testVal');
    }
    assert.throws(errorFn, /不是一个正则表达式或者数组/);
  });
});
