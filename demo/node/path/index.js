var path = require('path');

console.log('require.resolve => ' + require.resolve('./index.js'));
console.log('path.resolve(./) => ' + path.resolve('./index.js'));
console.log('__dirname => ' + __dirname);


// 查询当前完整的模块名
console.log(require.resolve('./'));