'use strict';

function demo1(){
    var arr = [1, '10', 2, 30];
    console.log(eval(arr.join('+')));
}
demo1();


this.xx = 1;
function demo2(){
    eval("("+ (this.xx=2) +")");
}
demo2();
console.log(this.xx);


this.xx = 1;
function demo3(){
    eval("("+ (this.xx=2) +")");
}
demo3.call({});
console.log(this.xx);


function demo4(){
    eval("(var b = 3)");
    console.log(b);
}
demo4();


function demo5(){
    var json = '{"xxoo":1}';
    var a = eval('('+ json +')');
    console.log(a, typeof a);
}
demo5();