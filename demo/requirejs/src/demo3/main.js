/**
 * main
 * @author xieliang
 */

define(['./data', 'jquery', ''], function(data, $) {
    $('h1').text(JSON.stringify(data));
});