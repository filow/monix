/* eslint-disable no-undef */
// 设置监听的地址为0.0.0.0,即接收所有主机的访问
set('host', '0.0.0.0');
// 设置端口为3456
set('port', 3456);
// 实例化随机数生成器
const R = new Random();


// ===== 基础示例 =====
// 最简单的调用形式，[verb](path, data)
// 响应：{"msg":"ok"}
get('/simple_data', { msg: 'ok' });
// 带有随机内容的简单形式，一次生成4组数据
// 响应示例：
// [{"bool":true,"int":59,"name":"高淹"},{"bool":false,"int":57,"name":"路韵"},{"bool":false,"int":100,"name":"蒲亿兑"},{"bool":true,"int":50,"name":"韦送佣"}]
get('/simple_random', R.n({
  bool: R.bool(),
  int: R.integer({ min: 30, max: 100 }),
  name: R.cnName(),
}, 4));
// 函数形式的数据区块
// 响应示例：["地址：安徽省日照市深州市","地址：宁夏回族自治区厦门市无极县","地址：江苏省常德市南宫市"]
post('/function_data', () => {
  return R.n(
    R.concat('地址：', R.address()), 3
  );
});


// ======== 强制返回内容 =======
// 定义一个注册功能的函数
function registHandler(res) {
  res.send(200, { success: true }, {
    header: {
      'X-UserId': R.mongoid()(), // 随机数产生器第一次调用返回函数，需两次调用才能获得普通形式的值
    },
  });
  res.send(403, { success: false });
}
// 默认情况返回最后一个res.send的值
// 响应：403 Forbidden {"success":false}
post('/regist_fail', registHandler);
// 强制返回内容后，返回了注册成功的提示
// 响应：200 OK
// X-UserId:		571f23fc70285b6ff860a715
// {"success":true}
post('/regist', {
  'response/forceStatus': 200,
}, registHandler);

// ====== 响应格式 ======
// 一般情况下默认使用json格式输出，所以输出字符串时，结果会加上引号
// 响应：
// Content-Type:		application/json
// "str"
get('/str/simple', 'str');
// 指定输出格式为plain后，以text/plain格式输出
// 响应:
// Content-Type:		text/plain
// str
get('/str/plain', { 'response/format': 'plain' }, 'str');

// ===== 批量设定以及动态设置键 ======
// 响应：
// X-Bar:		World
// X-Foo:		Hello
// {"scope":"get_setting_header","X-Foo":"Hello","X-Bar":"World"}
get('/setting/header', {
  // 以/作为结尾，即可批量设置这个命名空间内的值
  'header/': {
    // X-Foo, X-Bar是通过动态键定义的
    'X-Foo': 'Hello',
    'X-Bar': 'World',
  },
}, function echoHandler(res) {
  // 为了引用到Config对象，需要写成一般的函数形式
  res.ok({
    // scope是这个路由设置的空间，默认会生成一个名字
    scope: this.config.scope,
    'X-Foo': this.config.get('header/X-Foo'),
    'X-Bar': this.config.get('header/X-Bar'),
  });
});

// ===== 多地址监听 =====
// 访问http://127.0.0.1:5678/listen
// 响应：{"host":"127.0.0.1","port":5678}
get('/listen', {
  host: '127.0.0.1',
  port: 5678,
}, {
  host: '127.0.0.1',
  port: 5678,
});
// 访问http://127.0.0.1:5000/listen
// 访问http://192.168.1.4:5000/listen
// 访问http://0.0.0.0:5000/listen
// 响应：{"host":"0.0.0.0","port":5000}
get('/listen', {
  host: '0.0.0.0',
  port: 5000,
}, {
  host: '0.0.0.0',
  port: 5000,
});

// 路由定义顺序会影响匹配结果，所以更具体的路由应当放在更前面

// 访问http://127.0.0.1:3456/listen
// 响应：{"host":"127.0.0.1"}
get('/listen', {
  host: '127.0.0.1',
}, {
  host: '127.0.0.1',
});
// 访问http://192.168.1.4:3456/listen
// 访问http://0.0.0.0:3456/listen
// 响应：{"host":"default","port":3456}
get('/listen', {
  host: 'default',
  port: 3456,
});
