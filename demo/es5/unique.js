'use strict';

var len = 1000 * 1000;
var arr = [];
var arr2 = [];
new Array(len).join('1,').split(',').forEach(function() {
    var xxoo = get();
    arr.push(xxoo);
    arr2.push(xxoo);
});

function get() {
    return Math.round(Math.random() * (1000 - 1) + 1);
}


function forEach() {
    var result = [];
    var res = arr;
    var res = arr.sort(function(a, b) {
        return a > b ? 1 : -1;
    });
    res.forEach(function(val) {
        if (result[result.length - 1] !== val) {
            result.push(val);
        }
    });
    return result;
}


function obj() {
    var h = {},
        result = [];

    for (var i = 0, len = arr2.length; i < len; i++) {
        if (!h[arr2[i]]) {
            h[arr2[i]] = true;
            result.push(arr2[i]);
        }
    }
    return result;
}


console.time('forEach');
forEach();
console.timeEnd('forEach');

console.time('obj');
obj();
console.timeEnd('obj');


// var arr = [];
// var d = c.sort(function(a, b) {
//     return a > b ? 1 : -1;
// });
// d.forEach(function(val) {
//     if (arr[arr.length - 1] !== val) {
//         arr.push(val);
//     }
// });

// var h = {},
//     arr = [];
// for (var i = 0, len = c.`length;i<len; i++) {
//     if (!h[c[i]]) {
//         h[c[i]] = true;
//         arr.push(c[i]);
//     }
// }

// console.log(arr);