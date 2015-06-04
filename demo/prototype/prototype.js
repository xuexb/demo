'use strict';

/**
 * 人

 */
function People(name, age){
    this.name = name;
    this.age = age;
}

/**
 * 说话
 */
People.prototype.say = function(){
    console.log('My name is '+ this.name +', is '+ this.age +' age');
}



/**
 * 工作
 * @param {string} name 名称
 * @param {int} age 年龄
 * @param {string} job 职位
 */
function Work(name, age, job){
    People.apply(this, [].slice(arguments));
    this.job = job;
}


Work.prototype = new People();
Work.prototype.say = function(){
    People.prototype.say.call(this);
    console.log('My word is '+ this.job);
}


var xiaowu = new People('xiaowu', 26);
var xieliang = new Work('xieliang', 26, 'fe');
xiaowu.say();
xieliang.say();