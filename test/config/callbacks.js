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
});
