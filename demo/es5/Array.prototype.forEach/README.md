# Array.prototype.forEach

常用于循环一个数组、对数组里的数据追加

```js
/**
 * @file 数组循环
 * @author xiaowu
 *
 * @description 循环不可被停止
 * @param {Function} fn 回调，参数1为当前循环的值，参数2为索引，参数3为目标数组
 * @param {Object|undefined} context 回调fn的this的上下文
 * @return {undefined} 无返回值
 * @example
 *     Array.prototype.forEach(fn [,context]);
 */

// 对数据追加：
var arr2 = [
    {
        a: 3
    }
];
arr2.forEach(function (val) {
    val.b = 3;
});
console.log(arr2);
```

## 兼容性

兼容 `ie9+` ，[link](http://kangax.github.io/compat-table/es5/#test-Array.prototype.forEach)