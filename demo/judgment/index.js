/**
 * @file 测试==和===的性能
 * @author xiaowu
 */

var length = 10000 * 1000;
var Test = {};
var obj = {
    toString: () => 1,
    valueOf: () => 1
};

Test['1 === 1'] = () => {
    return 1 === 1;
};

Test['1 === "1"'] = () => {
    return 1 === obj;
};

Test['1 == 1'] = () => {
    return 1 == 1;
};

Test['1 == "1"'] = () => {
    return 1 == obj;
};

Test['1 === parseInt("1", 10)'] = () => {
    return 1 === parseInt("1", 10);
};

Test['1 === "10" >> 0'] = () => {
    return 1 === "10" >> 0;
};

Object.keys(Test).forEach((key) => {
    console.time(key);
    new Array(length).join(',').split(',').forEach(() => {
        Test[key]();
    });
    console.timeEnd(key);
});