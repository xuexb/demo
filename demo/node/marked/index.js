var marked = require('marked');

var str = '[window.close()](javascript:window.close())';

console.log(str);
console.log(marked(str));