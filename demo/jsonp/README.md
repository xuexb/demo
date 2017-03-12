# jsonp

原理是靠`window.callbackname = fn`+后端响应`callback`+`createElement('script')`完成

### 前端思路

1. 创建一个`script`标签
2. 创建一个挂靠在`window`上的方法, 比如`jQuery+随机数`, 把回掉方法写到这个`window`上
3. 把后端地址设置到`script`并插入到文档, 地址可以约定后端返回的`callback`名称, 可以写死, 也可以获取`get`参数

```js
var jsonp = (function () {
        var expando = 'xiaowu_';
        var jsonpId = 0;

        return function (url, data, callback) {
            // 超时计时
            var timer = null;

            // 获取随机的方法名
            var callbackName = expando + (jsonpId++);

            // 把老的变量名先存起来, 以让成功后恢复
            var oldFn = window[callbackName];

            // 把老的方法恢复
            var recovery = function () {
                // 还原之前的方法
                window[callbackName] = oldFn;

                clearTimeout(timer);

                // 只恢复一次
                recovery = function () {};
                timer = script = oldFn = null;
            };

            // 如果只传了 (url, callback)
            if ('function' === typeof data) {
                callback = data;
                data = null;
            }

            // 添加新的回调
            window[callbackName] = function () {
                // 执行方法的回调
                if ('function' === typeof callback) {
                    callback.apply(null, [].slice.call(arguments));
                }

                // 恢复变量
                recovery();
            };

            // 处理 ?callback=xiaowu_id
            if (url.indexOf('?') < 0) {
                url += '?';
            }

            url += '&callback=' + callbackName;

            // 如果有数据, 则追加到url中, 数据只会处理成get参数
            if (data) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(data[key] || '');
                    }
                }
            }

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // 在加载完成, 出错, 取消时恢复方法
            script.onload = onerror = onabort = function () {
                recovery();
            };

            timer = setTimeout(function () {
                recovery();
            }, 5000);

            document.body.appendChild(script);
        };
    })();
```


用时:

```js
jsonp(url, function (data) {});

jsonp(url, {}, function (data) {});
```

### 后端思路

1. 固定回调方法名 - 在已知且不变的场景下可以固定`callback`名称, 比如: `window.LoginCallback({})`
1. 动态回调方法名 - 可以根据前端请求链接中的参数来动态的返回, 如:

```php
<?php
// 添加响应header
header('Content-type: application/json');

$callback = isset($_GET['callback']) && !empty($_GET['callback']) ? $_GET['callback'] : 'xiaowu';

$data = array(
    'status' => 200,
    'data' => array(
        'username' => 'xiaowu',
    ),
);

echo '"function" === typeof ' . $callback . ' && ' . $callback . '(' . json_encode($data) . ')';
```

结果如:

```js
"function" === typeof jquery && jquery({"status":200,"data":{"username":"xiaowu"}})
```

当前还要考虑白名单、安全性等因素, 一般框架都会集成这块, 直接使用数据调用就行了.
