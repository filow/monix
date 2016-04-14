const assert = require('assert');
const monix = require('../../../');
const api = monix.default.api;
const Config = require('../../../lib/config').default;

describe('Server#config', () => {
  const scope = Config.scope('/');
  it('protocol', () => {
    api.set('protocol', 'https');
    assert.equal('http', scope.get('protocol'));
    api.set('protocol', 'http');
    assert.equal('http', scope.get('protocol'));
    api.set('protocol', 123456);
    assert.equal('http', scope.get('protocol'));
  });
});
