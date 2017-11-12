# 前端学习指南

### 代码缩进

不论什么语言代码，都应该保持一个良好的缩进。

js ：

```js
// good
var fn = function (num) {
    if (num > 3) {
        return '大于3';
    }

    return '默认';
};

// bad
var fn = function (num) {
if (num > 3) {
return '大于3';
}
return '默认';
};
```