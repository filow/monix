/* eslint-disable no-undef */
get('/', res => {
  res.ok({ msg: 'ok' });
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
