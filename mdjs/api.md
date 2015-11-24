## 接口

> 实例对象接口

## get_render_nav

```js
/**
 * 获取渲染后的导航html代码
 *
 * @param  {string|undefined} uri 当前高亮的路径，如果为空则全不高亮， 高亮即展开
 *
 * @return {string}     html代码
 */
```

## clear_cache

```js
/**
 * 清空缓存
 *
 * @return {Object} this
 */
```

## get_list

```js
/**
 * 获取navtree使用数据，会追加options.links
 *
 * @description 会先读取缓存
 * @return {Array} 数组
 */
```

## renderMarkdown

```js
 /**
 * 渲染md文件
 *
 * @param  {string} content md源码
 *
 * @return {Object}         {content:html代码, catalog: h2,3分类}
 */
```

## express

在实例对象上有`express`接口，如：

```js
'use strict';

var Mdocjs = require('mdjs');

var app = new Mdocjs();

var express = app.express;
```

<a id="express-hook" name="express-hook"></a>
### 制作更新勾子

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
