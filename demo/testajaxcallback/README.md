# 异步回调的研究

这里是指在写`ajax`异步请求时该如果写回调呢？写啥回调呢？错误时触发哪个回调呢？

常见的有：
```js
$.post(url, {}, function(res){
    
}, 'json');
```

殊不知这种在出错的时候没有任何的处理。。。

通常我这样写：

```js
$.ajax({
    url: '',
    data: {},
    dataType: 'json',
    type: 'POST',
    success: function(res){},
    error: function(){},
    complete: function(){}
});
```

你可能在说，代码可能有点多，其实我感觉只要业余清晰，代码多点也是能接受的，当然你可以用伟大的`promise`处理回调。。。在`jquery`里她转换成了`deferred`

## 一定要考虑的

* 缓存问题，这个通常发生在`ie`低版本，如`ie7`，一般使用`时间缀`解决
* `loading`的状态，一定要让用户知道当前处理`正在请求`过程中
* 返回值出错，通常给予友好提示
* 服务器出错，其中包括`404`,`500`等状态
* 网络超时，一般有个时间限制
* 用户主动中断请求，如：`abort`

比如我的代码片断：

```js
// 判断逻辑，如果成功才发请求

// 给出loading状态

// 发送请求，并所当前请求存放起来，以方便用户主动清除
XHR = $.ajax({
    url: '',
    data: {},
    dataType: 'json',
    type: 'POST',
    success: function(res){
        if(res && res.errcode === 0){
            // 成功
        } else {
            // 返回值不理想
        }
    },
    error: function(xhr, status){
        // status => timeout,parsererror,error,abort
        if(xhr && status !== 'abort'){
            // 如果不是用户主动中断
        }
    },
    complete: function(){
        // 关闭loading
    }
});
```

注：不管成功或者失败都会执行`complete`回调，且是在`error`或`success`后执行

### 回调触发的类型

### error
> 错误回调，相当于`fail`

当后端出错，或者服务器状态码不为`200`，会触发`error`，第二参数为`error`

当返回值解析错误时触发`error`，第二个参数为`parsererror`

当响应超时时触发`error`，第二个参数为`timeout`

当用户主动中断请求时触发`error`，第二个参数为`abort`

以上是在`jquery`和`zepto`中测试

### success

> 成功回调，相当于`done`

在`jquery`中当返回状态为`200`且内容正常解析后触发

在`zepto`中当返回值状态为`200`且**内容不为空**时触发，这是一个坑啊。。。

### complete
> 完成回调，相当于`always`

不管成功还是失败，该事件总会执行，顺序在`success`和`error`之后

下面贴2个测试：

* [jquery版本](https://github.xuexb.com/demo/testajaxcallback/jquery.html)
* [zepto版本](https://github.xuexb.com/demo/testajaxcallback/zepto.html)


