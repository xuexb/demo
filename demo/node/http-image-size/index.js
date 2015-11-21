var size = require('http-image-size');

size('https://github.xuexb.com/uploads/docjs/1.png', function (err, dimensions, length) {
    console.log(err, dimensions, length);
});
