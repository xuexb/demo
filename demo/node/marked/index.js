// node
'use strict';

var fs = require('fs');
var tpl = fs.readFileSync('./tpl.md').toString();
var marked = require('marked');

var guid = 1;
var arr = [];
var obj = {};

var renderer = new marked.Renderer();

// 渲染代码
renderer.code = function (data, lang) {
    var id = guid ++;

    arr.push(id);

    data = require('highlight.js').highlightAuto(data).value;
    obj[id] = '<pre><code class="hljs lang-' + lang + '">' + data + '</code></pre>';
console.log('{{{'+ id +'}}}')
    return '{{{'+ id +'}}}';    
};

// 配置
marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false

});

// 转换
tpl = marked(tpl);

// 去换行
tpl = tpl.replace(/[\r\n]/g, '');

arr.forEach(function(id){
    tpl = tpl.replace('{{{'+ id +'}}}', obj[id] || '');
    console.log(id)
});

console.log(arr)

// console.log(tpl);
