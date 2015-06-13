'use strict';


//this指针
function demo1() {
    var a = new Function('console.log(this===window);');
    console.log(a);
    a();
}
// demo1();


//参数
function demo2() {
    var a = new Function('a,b,c', 'console.log(a,b,c);');
    console.log(a);
    a(1, 2);
}
// demo2();


function demo3() {
    Array.prototype.jiajia = function() {
        var num = 0;
        this.forEach(function(val) {
            num += Array.isArray(val) ? val.jiajia() : parseFloat(val, 10) || 0;
        });
        return num;
    }

    var join = new Function('return [].jiajia.call([].slice.call(arguments));');

    console.log(join('1', 2));
    console.log(join('1', 'numx'));
    console.log(join('1', [1, 2]));
    console.log(join('1', [1, [1, [1, [1, ['arr']]]]]));
}
// demo3();


function demo4() {
    var json = '{"xxoo":1}';
    json = new Function('return ' + json)();
    console.log(json, typeof json);
}
demo4();


function demo5(){
    new Function('console.log(this===window,this.xxoo);')();
}
demo5.call({
    xxoo: 1,
});


function demo6(){
    new Function('console.log(this===window,this.xxoo);').call({
        xxoo: 2,
    });
}
demo6.call({
    xxoo: 1,
});