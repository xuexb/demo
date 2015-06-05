'use strict';

//作用域跟this不一样，this只有在 call,apply,new

var window = typeof window !== void 0 ? window : global || {};

function a() {
    console.log(this === window || global); //true
}
a();

(function() {
    var xo = 'xo';
    // console.log(this === window);
    console.log(this.xo); //undefined//因为this===window
})();

function b() {
    console.log(this.name);
}
b();
b.call({
    name: 'bo'
});

console.log('=====');


var c = {
    name: 'co',
    get: function() {
        console.log(this.name);
    }
}
c.get(); //co
c.get.call({}); //void 0
var d = c;
d.get(); //co
var e = c.get;
e(); //void 0
e.call({
    name: ' eo'
}); //eo



var i = 0;
for (; i < 1; i++) {
    console.log(this, this.a);
}

function m() {
    var i = 0;
    for (; i < 1; i++) {
        console.log(this, this.a);
    }
}
m();

(function(){
    m();
})();

(function(){

    function d(){
        console.log(this);
        var c = m;
        var a = 1;
        c();
    }
    d();
})();

(function(){
    m();
}).call({a:1});

(function(){
    m.call(this);
}).call({a:1});