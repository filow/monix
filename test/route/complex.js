const request = require('supertest');
const mo = require('../../');
const core = mo.core;

// 高级用法中，使用res.ok创建多重结果，默认选取最后一次出现的
mo.get('/function', res => {
  res.ok(() => 111);
});

mo.get('/array', res => {
  res.ok(() => [1, 2, 3]);
});

mo.get('/random', (res, r) => {
  res.ok(r.randexp(/s{3}/));
});

mo.get('/nested', (res, r) => {
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

mo.get('/responseConfig', (res) => {
  res.ok({ msg: 'ok' }, {
    header: {
      'X-Test-Key': 'Foo',
    },
  });
});

mo.get('/res.send', (res) => {
  res.send(304, { msg: 'ok' });
});


describe('route#complex', () => {
  const server = core.Server._koa.listen();
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

  it('带参数的res.ok方法', done => {
    request(server).get('/responseConfig')
    .expect('X-Test-Key', 'Foo')
    .expect({ msg: 'ok' }, done);
  });

  it('res.send', done => {
    request(server).get('/res.send')
    .expect(304, done);
  });
});
