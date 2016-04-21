# Monix

[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependencies][david-image]][david-url]

一个基于Node.js的Mock Server工具，工作方式类似于mocha，编写一个简单的配置文件，然后用这个工具运行，一个“够用”的Mock Server就搭建成功了🎉🎉
>本项目目前还是0.1版本，没有足够的用例证明其稳定性，在使用如果发现了问题也欢迎通过issue方式提交BUG。

## 安装
首先确保你安装了Node.js环境，你可以通过[nvm](https://github.com/creationix/nvm)安装，也可以在[nodejs.org](nodejs.org)上下载安装包安装。

请确保您的Node.js版本大于4.0。使用以下命令查看版本号：
```bash
> node -v
v5.10.1
```
通过Node.js自带的npm安装：
```bash
npm install monix -g
```
要确认你已经正确安装了Monix，可以运行`monix -V`

## 调用方式
### 配置文件方式
你需要新建一个`.js`文件，然后输入类似于这样的内容：
```javascript
get('/', 'hello world!');
```
保存后，运行`monix [你的文件名]`就会启动服务器
```bash
> monix test/cli/test.js
17:57:51 [DEBUG] Router#regist [GET] / 	name: get_
17:57:51 [INFO] [主服务器] 监听: http://localhost:3456
```
按照提示访问这个网址就能看到Hello world了😉
### 包引入方式
如果你希望monix成为你项目中的一部分而不是单独的程序，那么可以直接使用require引入这个包：
```javascript
const app = require('monix');
app.get('/', 'hello world!');
// 最后用这个命令启动服务器
app.core.Server.run();
```

## 基础用法


[travis-image]: https://img.shields.io/travis/filow/monix/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/filow/monix
[coveralls-image]: https://coveralls.io/repos/github/filow/monix/badge.svg?branch=master&style=flat-square)
[coveralls-url]: https://coveralls.io/github/filow/monix?branch=master
[david-image]: https://david-dm.org/filow/monix.svg?style=flat-square
[david-url]: https://david-dm.org/filow/monix.svg
