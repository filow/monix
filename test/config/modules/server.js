const assert = require('assert');
const monix = require('../../../');
const api = monix.api;
const Config = monix.core.Config;

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
