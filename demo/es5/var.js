'use strict';

var a = 1;
console.log(this.a);
console.log(a);


this.b = 1;
console.log(this.b);
console.log(typeof b);


(function() {
    var c = 3;
    console.log(c);
    console.log(this.c);
}).call(this);


this.d = 4;
(function() {
    var d = 3333;
    console.log(d);
    console.log(this.d);
}).call(this);


(function() {
    (function() {
        console.log(this); //window
        // console.log(this.a);
    })();
}).call(this);


(function() {
    console.log(a);
    var a = 3;
})();

(function() {
    console.log(a);
    for (var i = 1; i < 10; i++) {
        var a = i;
    }
    console.log(a, i);
})();


(function() {
    var x = 1;
    var y = 1;
    var z = 1;

    function a() {
        var y = 2;

        function b() {
            var y = 3;

            function c() {
                console.log(x, y);
                z = 'c';
            }

            c();
        }

        console.log(x, y);

        b();

    }
    console.log(x, y, z);
    a();
    console.log(z);
})();