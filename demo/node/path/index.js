var path = require('path');

console.log('require.resolve => ' + require.resolve('./index.js'));
console.log('path.resolve(./) => ' + path.resolve('./index.js'));
console.log('__dirname => ' + __dirname);