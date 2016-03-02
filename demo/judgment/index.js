
var length = 10000 * 10000;
var Test = {};

Test['1 === 1'] = () => {
    return 1 === 1;
};

Test['1 === "1"'] = () => {
    return 1 === "1";
};

Test['1 == 1'] = () => {
    return 1 == 1;
};

Test['1 == "1"'] = () => {
    return 1 == "1";
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