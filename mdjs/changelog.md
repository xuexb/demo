# 更新日志

## 0.1.3

* 修复绑定的`hook`不被执行，因为`更新勾子`是在`serve-index`初始化后，而`serve-index`是会拦截`post`请求，[serve-index源码](https://github.com/expressjs/serve-index/blob/master/index.js#L102-L108)，现把初始化`serve-index`服务放在`run`方法内，对使用没有任何影响

## 0.1.2

* 添加目录浏览功能（当没有找到默认主页时）
* 添加可配置的默认主页（必须是`.md`），详情：[options.default_index](./options.md)
* 添加简单搜索（目录只是搜索导致目录里的文件名），使用 [typeahead.js](http://twitter.github.io/typeahead.js/examples/)
* 去掉依赖的`extend`，使用`Object.assign`
* 添加`babel-runtime`环境
* 优化导航目录排序，采用`目录>文件`方式

## 0.1.1

* 优化移动端样式

## 0.1.0

* 优化默认主页，修复`/?source=true`不能浏览源码
* 添加`run()`接口，实例化后必须调用该接口启动服务，为了配合多`express`实例调用，后续添加相关说明
* 添加测试用例，目前代码覆盖率为`100%`
* 优化获取`md`标题
* 修复获取`md`数据里代码渲染问题

## 0.0.x

* 从`docjs`迁移过来
* 使用`es6`开发
* 支持默认主页
* 支持`?source=true`方式浏览`md`源码
* 添加`debug`功能，开启后不缓存数据，适合本地开发
* 支持`package.json`里配置参数 [json配置](./options.md#h2-1)