# node中路径位置

当文件路径是：`/a/b/c/index.js`：

```js
var path = require('path');

console.log('require.resolve => ' + require.resolve('./index.js'));
console.log('path.resolve(./index.js) => ' + path.resolve('./index.js'));
console.log('__dirname => ' + __dirname);
```

执行`cd /a/b/c/ && node ./index.js`输出的结果是：

```
require.resolve => /a/b/c/index.js
path.resolve(./index.js) => /a/b/c/index.js
__dirname => /a/b/c
```

执行`cd / && node /a/b/c/index.js`输出的结果是：

```
require.resolve => /a/b/c/index.js
path.resolve(./index.js) => /index.js
__dirname => /a/b/c
```

## 结论

* `path.resolve(./)`是以当前`node`执行目录为基线
* `require.resolve('./')`是以执行文件目录为基线
* 也就能解决为啥`require('./')`也是以执行文件目录为基线了
* `__dirname`当前执行文件目录为基线的绝对路径

> ps：之前一直用`path.resolve(__dirname, './index.js')`来查找当前文件目录下的`index.js`，现在可以直接使用`require.resolve('./index.js')`来引用了，么么哒～
