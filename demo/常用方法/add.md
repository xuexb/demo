# 函数柯里化

[张大大的文章说明](http://www.zhangxinxu.com/wordpress/2013/02/js-currying/)

```js
var add = (function () {
    var count = 0;

    var callback = function () {
        var i = 0;
        var len = arguments.length;

        for (; i < len; i++) {
            count += parseInt(arguments[i], 10) || 0;
        }
        
        return callback;
    };

    callback.valueOf = callback.toString = function () {
        return count;
    };

    return callback;
})();


console.log(add(1, 2, 3)(3));

console.log(add(1, 1, 1));
```