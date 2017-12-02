# 解析字符串为 JSON 对象

```js
/**
 * 解析字符串为 JSON 对象
 *
 * @param  {string} str 需要解析的字符串
 *
 * @return {Object}
 */
function parseJSON(str) {
    var data = null;

    try {
        data = JSON.parse(str);
    }
    catch (e) {}

    if (data === null && str !== 'null') {
        try {
            data = new Function('return ' + str).call({});
        }
        catch (e) {}
    }

    return data;
}
```

1. 优先使用 `JSON.parse`
1. 使用 `call` 控制作用域, 防止污染 `this`

### bug

这将导致有 JS XSS ，如： `parseJSON('window.alert(1)')` 。还是原生的 `JSON.parse` 靠谱。多谢 [@Wei](https://whe.me/) 的提醒。