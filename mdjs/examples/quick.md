# 快速使用

在任意目录创建一个目录，如：`mkdir demo && cd demo`，新创建`package.json`，内容如：

```json
{
  "name": "demo",
  "version": "1.0.0",
  "description": "demo",
  "main": "index.js",
  "directories": {
    "example": "examples"
  },
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "mdjs": "*"
  }
}
```

> 注：`devDependencies`表示开发依赖`mdjs`，`*`表示最新版

然后创建`index.js`，内容如：

```js
'use strict';

var Mdjs = require('mdjs');

// 实例化
var app = new Mdjs();

// 清空缓存
app.clear_cache();

// 运行跑起来
app.run();
```

然后创建`README.md`，内容如：

```markdown
# 我是demo
```

> 注：`mdjs`以该`README.md`为默认主页

