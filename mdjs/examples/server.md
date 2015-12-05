# 实现内网文档平台

在内网某机器上搭建个文档平台，使用`git`做版本控制，开发者可`push`到服务器，平台上使用`hook`自动更新，比如技术文档平台、接口文档平台等

## 搭建git server

有几种形式可以使用：

* 自行搭建内网`git server`
* 如果是公开的可使用`github`，
* 如果是私有的可使用`git.oschina.net`
* 或者搭建内网`gitlab`

## 使用mdjs搭建平台

```js
'use strict';

var Mdjs = require('mdjs');
var child_process = require('child_process');

var app = new Mdjs();

// 更新勾子
app.express.post('/update', function (req, res, next) {
    child_process.exec('git pull', {
        cwd: app.options.root
    }, function (a, b) {
        console.log(a, b, new Date().getTime());

        // 清空缓存
        app.clear_cache();
    });

    res.end('ok');
});

// 运行
app.run();
```

## 配置git server勾子

配置`push`时请求`{平台域名}/update`

---

至此完成推送时自动更新的文档平台