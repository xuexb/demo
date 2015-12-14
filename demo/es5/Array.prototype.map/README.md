# Array.prototype.map

常用于用一个数组生成别一个数组

```js
/**
 * @file 数组map
 *
 * @param {Function} fn 回调，参数1为当前循环的值，参数2为索引，参数3为目标数组
 * @param {Object|undefined} context 回调fn的this的上下文
 * @return {Array} 回调的返回值数组
 * @example
 *     Array.prototype.map(fn [,context]);
 */
```

## 兼容性

兼容 `ie9+` ，[link](http://kangax.github.io/compat-table/es5/#test-Array.prototype.map)