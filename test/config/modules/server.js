const assert = require('assert');
const mo = require('../../../');
const Config = mo.core.Config;

describe('Server#config', () => {
  const scope = Config.scope('/');
  it('protocol', () => {
    mo.set('protocol', 'https');
    assert.equal('http', scope.get('protocol'));
    mo.set('protocol', 'http');
    assert.equal('http', scope.get('protocol'));
    mo.set('protocol', 123456);
    assert.equal('http', scope.get('protocol'));
  });

  it('run', () => {
    assert.ok(mo.core.Server.run());
  });
});
