var pdiff = require('page-diff');
var walkOpt = {
};
var diffOpt = {};
var url1 = 'https://github.xuexb.com/demo/page-diff/1.html';
var url2 = 'https://github.xuexb.com/demo/page-diff/2.html';


var webpage = require('webpage');
var page = webpage.create();

page.open(url1, function () {
    page.render('img/left.png');
    console.log('left render ok');

    var left = page.evaluate(pdiff.walk, walkOpt);
    console.log('left evaluate ok');
    page.open(url2, function () {
        page.render('img/right.png');
        console.log('right render ok');

        var right = page.evaluate(pdiff.walk, walkOpt);
        console.log('right evaluate ok');
        var ret = pdiff.diff(left, right, diffOpt);
        console.log('diff ok');
        var hlOpt = {
            diff: ret,
            left: {
                rect: left.rect,
                title: 'old version',
                screenshot: 'img/left.png'
            },
            right: {
                rect: right.rect,
                title: 'new version',
                screenshot: 'img/right.png'
            },
            page: webpage.create()
        };
        pdiff.highlight(hlOpt, function (err, page) {
            if (err) {
                console.log('[ERROR] ' + err);
                console.log('highlight err');
            }
            else {
                page.render('img/diff.png');
                console.log('highlight ok');
            }
        });
    });
});
