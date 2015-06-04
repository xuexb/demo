'use strict';


Object.prototype.test = 1;
Object.prototype.test2 = 1;
Array.prototype.x = 1;
Array.prototype.x2 = 1;


var i = 0;
var arr = [
    'a', 'b', 'c', 'd'
]
for(; i<arr.length; i++){
    console.log(i);
}



console.log('====================');
var obj = {
    'a': 1,
    'b': 2,
    'c': 3,
}
var i2 = 0;
obj.length = 3;
for(;i2<obj.length;i2++){
    console.log(i2);
}