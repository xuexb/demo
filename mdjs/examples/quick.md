# 快速使用

在任意目录创建一个目录并进入目录，如：`mkdir demo && cd demo`，并创建`package.json`，内容如：

```json
{
  "name": "demo",
  "version": "1.0.0",
  "devDependencies": {
    "mdjs": "*"
  }
}
```

> 注：`devDependencies`表示开发依赖，这里依赖`mdjs`，`*`表示最新版

然后创建`index.js`，内容如：

```js
'use strict';

var Mdjs = require('mdjs');

// 实例化
var app = new Mdjs({
    // 本地开发启动debug则不缓存文件
    debug: true
});

// 清空缓存
app.clear_cache();

// 运行跑起来
app.run();
```

然后创建`README.md`，内容如：

```markdown
# 我是demo

> 这里是引用

## h2
```

> 注：`mdjs`以该`README.md`为默认主页

## 安装依赖并启动

执行`npm install`安装依赖文件，执行`node index`启动`mdjs`，默认端口为`8091`，即访问 [127.0.0.1:8091](http://127.0.0.1:8091/) 。

然后就可以在`demo/`这个目录里随便添加`markdown`文件或者文件夹了。

## 配置

[更多配置](../options.md)