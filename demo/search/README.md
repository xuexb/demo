# 搜索逻辑

> 异步使用[test-ajax](https://github.com/xuexb/test-ajax)驱动

写一些常用异步搜索的逻辑

## 简单

简单的使用3个变量来存放参数，当点击链接时写入变量，并发送请求，参数可追加～ 类型是单行单选～

[demo](jiandan.html)


## 委托

使用默认定义一个数据对象，并委托所有的链接，连接上具有`data-type`的类型标识，具有`data-id`的`id`标识

[demo](delegate.html)

## 插件化

* 插件只负责处理`添加，删除，获取`数据的功能，并处理连续的请求，其他功能由逻辑代码实现
* 支持重复请求，后面的会把前面的清除掉，从而解决网络不稳定时并发多个顺序的`bug`
* 可实现单选，多选，下拉，文本框等功能

[demo](search.html)