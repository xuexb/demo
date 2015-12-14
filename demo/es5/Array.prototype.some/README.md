# Array.prototype.some

常用于判断数组里的某些数据是否有不符合预期的，因一旦条件成立，可立即退出循环

```js
/**
 * @file 只要有一个满足就为true
 *
 * @description 操作的数组不会对原数组有影响
 *              如果有一个返回true则退出当前循环
 * @param {Function} fn 回调，参数1为当前循环的值，参数2为索引，参数3为目标数组
 * @param {Object|undefined} context 回调fn的this的上下文
 * @return {boolean} 判断结果，必须全部返回true才为true，否则为false
 * @example
 *     Array.prototype.some(fn [,context]);
 */
```

## 兼容性

兼容 `ie9+` ，[link](http://kangax.github.io/compat-table/es5/#test-Array.prototype.some)