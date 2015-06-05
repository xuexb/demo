// 在ie78里apply(this, null || undefined || {});会报错~


'use strict';


//继承
function Hello(name, age){
    this.name = name;
    this.age = age;
}
Hello.prototype.say = function(){
    console.log('My name is '+ this.name +', age is'+ this.age);
}

function People(name, age, work){
    Hello.apply(this, [].slice.call(arguments));
}
People.prototype = new Hello();
People.prototype.say = function(){
    Hello.prototype.say.call(this);
    console.log('ok');
}

var me = new Hello('xieliang', 26);
var xianxin = new People('xianxin', 26, 'fe');

me.say();
xianxin.say();