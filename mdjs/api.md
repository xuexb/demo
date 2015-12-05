## 接口

> 实例对象接口

## run

> 运行的`express.listen()`

```js
/**
 * 运行
 *
 * @return {Object} this
 */
app.run();
```

## get_render_nav

```js
/**
 * 获取渲染后的导航html代码
 *
 * @param  {string|undefined} uri 当前高亮的路径，如果为空则全不高亮， 高亮即展开
 *
 * @return {string}     html代码
 */
app.get_render_nav([uri]);
```

## clear_cache

```js
/**
 * 清空缓存
 *
 * @return {Object} this
 */
app.clear_cache();
```

## get_list

```js
/**
 * 获取navtree使用数据，会追加options.links
 *
 * @description 会先读取缓存
 * @return {Array} 数组
 */
app.get_list();
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
app.renderMarkdown(content);
```

## express

在实例对象上有`express`接口，如：

```js
'use strict';

var Mdjs = require('mdjs');

var app = new Mdjs().run();

var express = app.express;
```