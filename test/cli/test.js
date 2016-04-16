/* eslint-disable no-undef */
set('host', '0.0.0.0');
get('/', (res, rnd) => {
  res.ok({
    msg: 'ok',
    id: rnd.integer({ min: 1, max: 100 }),
    complex: {
      array: [rnd.bool(), rnd.randexp(/[01]{5}/)],
      string: 'sample',
      number: 121,
      userFunction() {
        return Math.random();
      },
    },
  });
});

get('/random', (res, r) => {
  res.ok(r.randexp(/s{3}/));
});

get('/string', res => {
  res.ok('ok');
});

get('/short_cut', {
  msg: 'ok',
});

get('/users/:id', res => {
  res.ok({ msg: 'ok' });
});

get(/\/users\/\d+/, res => {
  res.ok({ msg: 'ok' });
});

get('/number', res => {
  res.ok(123456);
});

get('/options', {}, res => {
  res.ok({ msg: 'ok' });
});

get('/nores', () => 'NoRes');
