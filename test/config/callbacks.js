/* eslint-disable prefer-template */
const assert = require('assert');
const Config = require('../../lib/config').default;
Config.regist('test', {
  number: {
    default: 1,
    onSet(newVal) {
      return newVal * 2;
    },
  },
  str: {
    default: 'foo',
    onSet(newVal) {
      return typeof newVal === 'string' ? newVal : undefined;
    },
    onGet(val) {
      return '_' + val;
    },
  },
  objectType: {
    default: new Date(111),
    validators: [Config.v.objectType('date')],
  },
  regexp: {
    default: '__word__',
    validators: [Config.v.regexp(/__\w+__/)],
  },
});
describe('Config回调', () => {
  const scope = Config.scope('/');
  it('number', () => {
    assert.equal(1, scope.get('test/number'));
    scope.set('test/number', 5);
    assert.equal(10, scope.get('test/number'));
  });

  it('str', () => {
    assert.equal('_foo', scope.get('test/str'));
    scope.set('test/str', 5);
    assert.equal('_foo', scope.get('test/str'));
    scope.set('test/str', { foo: 'bar' });
    assert.equal('_foo', scope.get('test/str'));
    scope.set('test/str', 'bar');
    assert.equal('_bar', scope.get('test/str'));
  });

  it('objectType', () => {
    assert.equal(111, Number(scope.get('test/objectType')));
    scope.set('test/objectType', 222);
    assert.equal(111, Number(scope.get('test/objectType')));
    scope.set('test/objectType', new Date(222));
    assert.equal(222, Number(scope.get('test/objectType')));
  });

  it('regexp', () => {
    assert.equal('__word__', scope.get('test/regexp'));
    scope.set('test/regexp', 'hello');
    assert.equal('__word__', scope.get('test/regexp'));
    scope.set('test/regexp', '_hello2_');
    assert.equal('__word__', scope.get('test/regexp'));
    scope.set('test/regexp', '__hello3__');
    assert.equal('__hello3__', scope.get('test/regexp'));
  });
});
