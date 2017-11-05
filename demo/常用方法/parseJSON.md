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