'use strict';

var arr = [];
var obj = {};
var str = ',';



// Array.prototype.indexOf = function(src, form) {
//     var index = 0,
//         indexOf = -1,
//         len = this.length;

//     if (form) {
//         form = parseInt(form, 10) || 0;

//         if (form) {
//             index = form;
//         }
//     }

//     for (; index < len; index++) {
//         if (this[index]) {
//             if (this[index] === src) {
//                 indexOf = index;
//                 break;
//             }
//         }
//     }

//     return indexOf;
// }

var i = 0;
var len = 1000* 10;
for (; i < len; i++) {
    arr.push(i);
    obj[i] = 1;
    str += i + ',';
}


function array() {
    var mark = false;
    var i = len-1;
    for (; i>=0; i--) {
        mark = arr.indexOf(i) !== -1;
    }
}


function object() {
    var mark = false;
    var i = len-1;
    for (; i>=0; i--) {
        mark = !!obj[i];
    }
}

function string() {
    var mark = false;
    var i = len -1;
    for (; i >=0 ; i--) {
        mark = str.indexOf(',' + i + ',') !== -1;
    }
}

console.time('array');
array();
console.timeEnd('array');

console.time('object');
object();
console.timeEnd('object');

console.time('string');
string();
console.timeEnd('string');