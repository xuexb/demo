var size = require('http-image-size');

console.time('a');
size('https://github.xuexb.com/uploads/docjs/1.spng', function (err, dimensions, length) {
    console.log(err, dimensions, length);
    console.timeEnd('a')
});
