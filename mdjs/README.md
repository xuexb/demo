# mdjs文档

一个纯洁的`md`文档在线浏览，`md`是指`markdown`

---

[![NPM Version](https://img.shields.io/npm/v/mdjs.svg)](https://npmjs.org/package/mdjs)
[![Linux Build](https://img.shields.io/travis/xuexb/mdjs/master.svg?label=linux)](https://travis-ci.org/xuexb/mdjs)
[![Windows Build](https://img.shields.io/appveyor/ci/xuexb/mdjs/master.svg?label=windows)](https://ci.appveyor.com/project/xuexb/mdjs)
[![Test Coverage](https://img.shields.io/coveralls/xuexb/mdjs/master.svg)](https://coveralls.io/r/xuexb/mdjs?branch=master)
[![star](https://img.shields.io/github/stars/xuexb/mdjs.svg?style=social&label=Star)](https://github.com/xuexb/mdjs/stargazers)
[![Follow](https://img.shields.io/github/followers/xuexb.svg?style=social&label=Follow)](https://github.com/xuexb)

## 功能

- [x] 目录导航自动抓取（递归抓取`options.root`目录下包含`.md`文件的非空目录）
- [x] `md`文件的导航文件名使用文件内第1个标题
- [x] 导航里目录支持别名`options.dir_alias`
- [x] 导航里追加自定义的链接`options.links`
- [x] 自定义勾子`express.get`
- [ ] 自制主题（其实感觉也没必要）
- [ ] 搜索

## 安装

```bash
npm install mdjs --save
```

## 启动

```js
var Mdjs = require('mdjs');

var app = new Mdjs().run();
```

## 快速使用

[快速使用](examples/quick.md)

## 作者

前端小武

* [Weibo](http://weibo.com/pcxuexb)
* fe.xiaowu(at)gmail.com
* [Blog](https://xuexb.com/)

## 参与开发

[参与开发](./dev.md)

## 感谢

`mdjs`默认的样式使用 [pjax](https://github.com/welefen/pjax) 和 [阮老师的es6样式](http://es6.ruanyifeng.com/)

## License

MIT

## Changelog

[changelog](./changelog.md)