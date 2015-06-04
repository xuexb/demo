'use strict';

function Hello(){}

Hello.prototype.value = 'value';

Hello.prototype.key = 'key';

Hello.prototype.callback = function(){}


var demo = new Hello();
demo.name = 3;
var key;
for(key in demo){
    console.log(key);
}
console.log('===========');
for(key in demo){
    if(demo.hasOwnProperty(key)){
        console.log(key);
    }
}



console.log('~~~~~~~~~~~~~~~~~~~');
Object.prototype.test = 1;
Object.prototype.testxx = 1;

var demo2 = {};
demo2.xxoo = 1;
demo2.ok = 3;
var key;
for(key in demo2){
    console.log(key);
}
console.log('===========');
for(key in demo2){
    if(demo2.hasOwnProperty(key)){
        console.log(key);
    }
}
