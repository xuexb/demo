'use strict';

function log(fn) {
    var result;

    try {
        console.log('try');
        fn()();
        result = 1;
    }
    catch (e) {
        console.log('catch');
        result = 2;
    }
    finally {
        console.log('finally');
        result = 3;
    }

    return result;
}

console.log(log(1));

console.log('========');

console.log(log(function () {
    console.log('fn');
}))

console.log('========');

console.log(log(function () {
    console.log('fn');
    return function () {};
}))
