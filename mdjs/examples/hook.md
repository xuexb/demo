# 勾子

> 常见于使用`svn/git`做版本控制时，当开发者`push`(推送)数据后，服务器自动更新，只是例子，具体情况视自己而定

```js
'use strict';

var Mdjs = require('mdjs');
var child_process = require('child_process');

var app = new Mdjs().clear_cache();

// 更新勾子
app.express.post('/update', function (req, res, next) {
    child_process.exec('git pull', {
        cwd: app.options.root
    }, function (a, b) {
        // 清空缓存
        app.clear_cache();

        // 重启pm2，重启是为了让配置生效
        // 如果没有使用package.json修改配置，可不用重启node进程
        child_process.exec('pm2 restart index.js', {
            cwd: app.options.root
        });
    });

    res.end('ok');
});

// 运行代码
app.run();
```
