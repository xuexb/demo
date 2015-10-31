'use strict';

/**
 * 结论：
 * 只在当前作用域生效，作用域可以被下面作用域继承
 * 变量不会提前声明
 * 在当前作用域下优化使用，且具有保护作用：“暂时性死区”（temporal dead zone，简称TDZ）
 * 参数里定义的顺序是从左到右，如果左侧有依赖右侧的参数就会报错
 * 不允许重复定义变量，var,let
 */


// 局部变量
// for(var i = 0; i<10; i++){
//     console.log(i);
// }
// console.log(i);

// for(let i2 = 0; i2<10; i2++){
//     console.log(i2);
// }
// console.log(i2);



// if(true){
//     var a = 1;
//     let b = 2;
// }
// console.log(a);
// console.log(b);



// var a = [];
// for (var i = 0; i < 10; i++) {
//   a[i] = function () {
//     // 因为i在这个fn里没有定义，要向上一级查找，而上一级就是var i，而var i的结果是10，so下面也是10
//     console.log(i);
//   };
// }
// a[6](); // 10

// var a = [];
// for (let i = 0; i < 10; i++) {
//   a[i] = function () {
//     // 这个fn里没定义，向上找，上面是用let定义的局部变量，所以这个就是当前的索引
//     console.log(i);
//   };
// }
// a[6](); // 6



// 局部变量不会变量提前声明
// console.log(typeof a);
// var a;

// console.log(typeof b);
// let b;



// let声明的变量在当前的作用域里会被保护起来
// var tmp = 123;
// if (true) {
//   let tmp;
//   tmp = 'abc'; // ReferenceError
//   console.log(tmp);
// }
// console.log(tmp);

// var a = 123;
// if (true) {
//     var a = 3;
//     console.log(a);
// }
// console.log(a);

// var a = 123;
// if (true) {
//     function fn(){
//         //向上查找变量
//         console.log(a);
//     }
//     fn();
// }
// console.log(a);

// let a = 123;
// if (true) {
//     function fn(){
//         //向上查找变量
//         console.log(a);
//     }
//     fn();
// }
// console.log(a);

// let a = 123;
// if (true) {
//     let a = 3;
//     console.log(a);
//     function fn(){
//         function fn2(){
//             // 向上查找
//             console.log(a);
//         }
//         fn2();
//     }
//     fn();
// }
// console.log(a);



// x=y， 但y是定义在x后面的
// function bar(x = y, y = 2) {
//   return [x, y];
// }
// bar(); // 报错



// 报错
// function fn() {
//   let a = 10;
//   var a = 1;
// }

// 报错
// function fn() {
//   let a = 10;
//   let sa = 1;
// }

// function f2() {
//   let n = 5;
//   if (true) {
//     // 因为var没有块级作用域，导致跟上一级的let冲突
//     var n = 10;
//   }
//   console.log(n); // 5
// }
// f2();


// 块级作用域的概念
// function f1() {
//   let n = 5;
//   if (true) {
//     let n = 10;
//   }
//   console.log(n); // 5
// }
// f1();

// function f2() {
//   let n = 5;
//   if (true) {
//     n = 10;
//   }
//   console.log(n); // 10
// }
// f2();





