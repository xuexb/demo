# Object.keys

```js
/**
 * @file 查找对象的key
 * @author xiaowu
 *
 * @description 如果为对象，不会返回原型链上的属性
 * @param {string|Object|Array} obj 要解析的对象,不可为空或者null
 * @return {Object} 解析后的对象
 * @example
 *     Object.keys([1]); => 返回数组索引
 *     Object.keys('1,2'); => 返回字符串索引
 *     Object.keys({a:1}); => 返回对象的key
 */
```


## 兼容性

兼容 `ie9+` ，[link](http://kangax.github.io/compat-table/es5/#test-Object.keys)