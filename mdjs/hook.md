# express接口

## 制作勾子

> 只是例子，具体情况视自己而定

```js
'use strict';

var Mdocjs = require('mdjs');
var child_process = require('child_process');

var app = new Mdocjs().clear_cache();

// 更新勾子
app.express.post('/update', function (req, res, next) {
    child_process.exec('git pull', {
        cwd: app.options.root
    }, function (a, b) {
        // 清空缓存
        app.clear_cache();

        // 重启pm2，重启是为了让配置生效
        child_process.exec('pm2 restart index.js', {
            cwd: app.options.root
        });
    });

    res.end('ok');
});
```