# 检测window多余的全局变量

原理是在页面创建一个纯洁的`iframe`, 然后用当前的全局变量和`iframe`里的对比得出结论~

```js
;(function (window) {
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    var iframeWindow = iframe.contentWindow;

    var result = Object.keys(window).filter(function (key) {
        return window.hasOwnProperty(key) && !iframeWindow.hasOwnProperty(key);
    });

    iframeWindow.console.log('以下是新增变量:\n' + JSON.stringify(result, null, 4));
})(window);
```