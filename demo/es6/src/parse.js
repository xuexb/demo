/**
 * 解析器
 * @author xiaowu
 */


'use strict';


// let [foo, [[bar], baz]] = [1, [[2], 3]];
// console.log(foo, bar, baz);

// function a(b, ...c){
//     console.log(b);
//     console.log(c);
// }
// a(1,3,5);

// function a2(...c){
//     console.log(c);
// }
// a2(1,3,5);

// let {a} = {a:3};
// console.log(a)


// let { length: data} = [3, 3, 4, 4, ,];
// console.log(data);

function add([x, y = 10]){
  return x + y;
}

console.log(add([1, 2]));
console.log(add([1]));
