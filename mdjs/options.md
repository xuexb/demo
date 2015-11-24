# 配置

## json配置

可以`启动目录`里创建`package.json`，内容如：

```json
{
    "mdjs": {
    }
}
```

## js配置

```js
'use strict';

var Mdocjs = require('mdjs');

new Mdocjs({});
```

## 默认配置

```js
{
    /**
     * 文档名
     *
     * @type {String}
     */
    name: 'mdjs',

    /**
     * 监听的端口
     *
     * @type {Number}
     */
    port: 8091,

    /**
     * 文档根目录
     *
     * @type {String}
     */
    root: './',

    /**
     * 缓存文件目录
     *
     * @type {String}
     */
    cache_path: './.cache/',

    /**
     * 目录别名
     *
     * @type {Object}
     */
    dir_alias: {},

    /**
     * mdjs静态资源前缀
     *
     * @description 监听内置的静态资源，配置是为了解决与别的名冲突
     * @type {String}
     */
    static_prefix: 'static',

    /**
     * 忽略的目录
     *
     * @type {Array}
     */
    ignore_dir: [
        '.svn',
        '.git',
        'node_modules'
    ],

    /**
     * 导航里额外追加的链接
     *
     * @example
     *     [
     *         {
     *             "text": "链接名称-默认往导航之前插件",
     *             "url": "链接"
     *         },
     *         {
     *             "text": "链接名称-往导航之后追加",
     *             "url": "链接",
     *             "type": "after"
     *         }
     *     ]
     * @type {Array}
     */
    links: [
    ],

    /**
     * 调试模式
     *
     * @description 开启后不使用缓存
     * @type {Boolean}
     */
    debug: false
}
```

## 配置顺序

`默认配置 -> json配置 -> js初始化配置`

> 后者会覆盖前者