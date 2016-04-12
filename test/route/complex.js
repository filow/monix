const request = require('supertest');
const monix = require('../../');
const api = monix.default.api;
const core = monix.default.monix;

api.get('/function', res => {
  res.ok(() => 111);
});

api.get('/array', res => {
  res.ok(() => [1, 2, 3]);
});

api.get('/random', (res, r) => {
  res.ok(r.randexp(/s{3}/));
});

api.get('/nested', (res, r) => {
  res.ok({
    id: r.integer({ min: 5, max: 5 }),
    array: [4, 'hello', { a: 1 },
      r.bool({ likelihood: 100 }),
      r.string({ pool: 'a', length: 5 }),
    ],
    object: {
      key: 'key',
    },
  });
});


describe('route#complex', () => {
  const server = core.Server.run();
  it('function', done => {
    request(server).get('/function')
    .expect('111', done);
  });

  it('array', done => {
    request(server).get('/array')
    .expect([1, 2, 3], done);
  });

  it('random', done => {
    request(server).get('/random')
    .expect(200, '"sss"', done);
  });

  it('nested', done => {
    request(server).get('/nested')
    .expect({
      id: 5,
      array: [4, 'hello', { a: 1 }, true, 'aaaaa'],
      object: {
        key: 'key',
      },
    }, done);
  });
});
