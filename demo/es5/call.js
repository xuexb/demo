'use strict';

//对象
var obj = {};
obj.name = 'xuexb';
obj.getName = function() {
    console.log(this.name);
}

obj.getName();
var getName = obj.getName;
getName();
obj.getName.call({
    name: 'xxoo'
});
getName.call({
    name: 'call'
});


function a(){
    console.log(this);
}
a();
a.call('test');//error必须传object