/**
 * @file json对象解析为字符串
 * @author xiaowu
 *
 * @description 同eval,new Function不同的是，该解析很严格，必须符合json要求
 */


'use strict';

var str = {
    a: 1,
    data: [
        {
            id: 1,
            name: '1'
        },
        {
            id: 2,
            name: '2'
        }
    ],
    fn: function () {},
    reg: new RegExp('1'),
    reg2: /1/,
    id: 1
};


console.log(JSON.stringify(str, ['id'], 2));


JSON.stringify({});                        // '{}'
JSON.stringify(true);                      // 'true'
JSON.stringify("foo");                     // '"foo"'
JSON.stringify([1, "false", false]);       // '[1,"false",false]'
JSON.stringify({ x: 5 });                  // '{"x":5}'

JSON.stringify({x: 5, y: 6});              
// '{"x":5,"y":6}' 或者 '{"y":6,"x":5}' 都可能
JSON.stringify([new Number(1), new String("false"), new Boolean(false)]); 
// '[1,"false",false]'
JSON.stringify({x: undefined, y: Object, z: Symbol("")}); 
// '{}'
JSON.stringify([undefined, Object, Symbol("")]);          
// '[null,null,null]' 
JSON.stringify({[Symbol("foo")]: "foo"});                 
// '{}'
JSON.stringify({[Symbol.for("foo")]: "foo"}, [Symbol.for("foo")]);
// '{}'
JSON.stringify({[Symbol.for("foo")]: "foo"}, function (k, v) {
  if (typeof k === "symbol"){
    return "a symbol";
  }
});

// '{}'  

// 不可枚举的属性默认会被忽略：
JSON.stringify( Object.create(null, { x: { value: 'x', enumerable: false }, y: { value: 'y', enumerable: true } }) );
// '{"y":"y"}'