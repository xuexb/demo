/**
 * indexOf(src, form_index)
 */

'use strict';

var arr = [
    'a', 'b', 'c', 'd', '1', 1, '0'
]

console.log(arr.indexOf('b'));
console.log(arr.indexOf(1, 3));
console.log(arr.indexOf(13, 3));
console.log(arr.indexOf('d'));



Array.prototype.indexOf = function(src, form) {
    var index = 0,
        indexOf = -1,
        len = this.length;

    if (form) {
        form = parseInt(form, 10) || 0;

        if (form) {
            index = form;
        }
    }

    for (; index < len; index++) {
        if (this[index]) {
            if (this[index] === src) {
                indexOf = index;
                break;
            }
        }
    }

    return indexOf;
}


console.log(arr.indexOf('b'));
console.log(arr.indexOf(1, 3));
console.log(arr.indexOf(13, 3));
console.log(arr.indexOf('d'));