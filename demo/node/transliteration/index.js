var slugify = require('transliteration').slugify;
var a = slugify('你好，世界');


var b = slugify('你好，世界', {
    lowercase: false,
    separator: '_'
});


console.log(a, b);