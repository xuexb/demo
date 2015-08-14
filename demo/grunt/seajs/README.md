# 自动化处理grunt任务

由于`grunt`要写项目打包发布需要写大量的任务`task`代码，且版本的发布不好维护，所以使用统一的结构，只需要简单的配置下。然后提供一些命令来发发布～

## 我和你有个约定

* 必须使用`src`为源代码目录，打包后是`dist`压缩目录（当然目录名支持配置）
* js支持`seajs`的`cmd`方式和普通`js`方式
* 由于依赖的`css-sprite`插件不支持一个样式多个`sprite`图的名称，顾`3.0`版本去掉`sprite`的支持，[传送门](https://github.com/laoshu133/grunt-css-sprite/issues/26)
* js里`require`必须以当前文件路径起，写`require('./xxx')`的格式
* css里`import`必须以当前文件路径起，写`import(./xxx.css)`的格式

## 安装
```
[sudo] npm intsall -g grunt-cli
[sudo] npm install
```

目前没有仓库可直接`clone`，请下载以下文件：

* [app.js](app.js)
* [Gruntfile.js](Gruntfile.js)
* [package.json](package.json)

## 提供的命令


**注意：代码正在重构，请不要用于生产环境，以下提供的命令是重构后的命令**


### grunt dist-css:{app_name}

打包压缩样式，配置如：

```js
// 路径以src目录为基础
/**
 * 全部样式
 */
css.all = '**/*.css';

/**
 * 测试全局
 */
css.global = 'css-global/global.css';

css.global = ['css-global/global.css', 'xx.css']
```

如果有需要合并的css，则在合并文件里使用`import`引用，切记这个路径是以当前css路径为基准，目标合并的样式如：

``` css
/* src/css-global.css */

/**
 * import是以当前路径起
 */
@import url(../lib/reset.css);
@import url(../lib/topbar.css);
@import url(../lib/foot.css);
@import url(./main.css);
```

使用`grunt dist-css`会把当前文件编译压缩到`dist`目录下，但注意的是`import`引用的目标文件不会编译，只会生成当前文件

[合并css的demo](tpl/css-global.html)

> 注：由于使用`import`方式处理合并文件，所以不需要`init,debug`