/* eslint-disable no-undef */
set('port', 5678);

get('/', {
  host: '192.168.1.4',
  port: 3456,
}, {
  host: '192.168.1.4',
  port: 3456,
});

get('/', {
  host: '127.0.0.1',
  port: 3456,
}, {
  host: '127.0.0.1',
  port: 3456,
});

get('/', {
  host: '0.0.0.0',
  port: 5000,
}, {
  host: '0.0.0.0',
  port: 5000,
});

get('/', {
  host: 'default',
  port: 5678,
});
