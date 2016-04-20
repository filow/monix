const request = require('supertest');
const assert = require('assert');
const mo = require('../../../');
const Config = mo.core.Config;
const routeName = '/config/modules/server.js';
mo.get(routeName, {
  host: '127.0.0.1',
  port: 17890,
}, {
  host: '127.0.0.1',
  port: 17890,
});

mo.get(`${routeName}-same`, {
  host: '127.0.0.1',
  port: 17890,
}, {
  name: 'same',
});

mo.get(routeName, {
  host: '127.0.0.1',
  port: 17891,
}, {
  host: '127.0.0.1',
  port: 17891,
});

mo.get(routeName, {
  host: '0.0.0.0',
  port: 17892,
}, {
  host: '0.0.0.0',
  port: 17892,
});
describe('Server#config', () => {
  const scope = Config.scope('/');
  mo.core.Server.run();

  before(() => {
    Config.set('/', 'skipUrlVerify', false);
  });

  after(() => {
    Config.set('/', 'skipUrlVerify', true);
  });

  it('protocol', () => {
    mo.set('protocol', 'https');
    assert.equal('http', scope.get('protocol'));
    mo.set('protocol', 'http');
    assert.equal('http', scope.get('protocol'));
    mo.set('protocol', 123456);
    assert.equal('http', scope.get('protocol'));
  });

  it('multi host and port listening - 1', (done) => {
    request('http://127.0.0.1:17890').get(routeName)
    .expect(200, {
      host: '127.0.0.1',
      port: 17890,
    }, done);
  });

  it('multi host and port listening - 2', (done) => {
    request('http://127.0.0.1:17891').get(routeName)
    .expect(200, {
      host: '127.0.0.1',
      port: 17891,
    }, done);
  });

  it('multi host and port listening - 3', (done) => {
    request('http://127.0.0.1:17892').get(routeName)
    .expect(200, {
      host: '0.0.0.0',
      port: 17892,
    }, done);
  });

  it('multi host and port listening - 4', (done) => {
    request('http://localhost:17890').get(routeName)
    .expect(404, done);
  });

  it('multi host and port listening - 5', (done) => {
    request('http://127.0.0.1:17890').get(`${routeName}-same`)
    .expect(200, { name: 'same' }, done);
  });
});
