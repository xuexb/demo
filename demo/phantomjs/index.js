var page = require('webpage').create();
// page.onResourceRequested = function (request) {
//     console.log('Request ' + JSON.stringify(request, undefined, 4));
// };
// page.onResourceReceived = function (response) {
//     console.log('Receive ' + JSON.stringify(response, undefined, 4));
// };

page.viewportSize = { width: 1280, height: 800 };


page.open('http://www.meishichina.com', function () {
    var title = page.evaluate(function () {
        return document.title;
    });
    var data = page.evaluate(function () {
        var $elem = $('body');

        return {
            width: $elem.width(),
            height: $elem.height(),
            left: $elem.offset().left,
            top: $elem.offset().top
        };
    });

    console.log(data.width, data.height, data.left, data.top);

    page.clipRect = data;

    page.render('meishi.png');
    phantom.exit();
});