# mdjs文档

一个纯洁的`md`文档在线浏览，`md`是指`markdown`

---

[![npm version](https://badge.fury.io/js/mdjs.svg)](https://badge.fury.io/js/mdjs) [![Build Status](https://travis-ci.org/xuexb/mdjs.svg?branch=master)](https://travis-ci.org/xuexb/mdjs) [![Coverage Status](https://coveralls.io/repos/xuexb/mdjs/badge.svg?branch=master&service=github)](https://coveralls.io/github/xuexb/mdjs?branch=master)

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

var app = new Mdjs(options);
```

`options`配置点这里：[配置](options.md)

---

## 由来

### 前世

前几年写文档一直是`Word`，然后发现很不优雅，并且不好做版本控制，后来认识她(`markdown`)后我就喜欢上了她，与是本地一直在有这个写。

但想让老大看下财报、结论啥的都要复制到邮件里发送，发现非常的反锁，我就在想能不能做一个浏览的功能呢？当然`github`提供浏览的服务，但在公司里多数文档是要求内网的，于是前期我只是用`node`写一个转换的工具，但发现当文件越来越多后页面不好展示，当然现在流行的`gitbook`可以满足功能，但必须手动的配置链接，我想要的是：

**一个简单的目录树形式的文档平台。**

### 今生

于是经过几天的码字，这一想法实现了，思路是通过`递归`读取目录里所有包含`.md`文件的数据，以目录树形式展现成导航，当点击时跳转到这个`md`文件，`md`文件是实时浏览的时候依赖`node marked`转成`html`输出到浏览器。


### 未来

未来不想修改太多，这也跟定位有关吧，只想做一个简单的`md`浏览。可能在该功能上做些优化，比如`搜索`。

## 定位

一个`md`在线浏览的服务，也符合`mdjs`这个命名。

## 感谢

`mdjs`默认的样式使用 [pjax](https://github.com/welefen/pjax) 和 [阮老师的es6样式](http://es6.ruanyifeng.com/)