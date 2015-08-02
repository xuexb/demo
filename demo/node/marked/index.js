// node
'use strict';

var fs = require('fs');
var tpl = fs.readFileSync('./tpl.md').toString();
var marked = require('marked');

var renderer = new marked.Renderer();

renderer.code = function (data, lang) {
    data = require('highlight.js').highlightAuto(data).value;
    return '<pre><code class="hljs lang-' + lang + '">' + data + '</code></pre>';
};

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

tpl = marked(tpl);

console.log('1');

console.log(tpl);
