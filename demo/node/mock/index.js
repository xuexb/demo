var Mock = require('mockjs');
var data = Mock.mock({
    'list|1-10': [{
        'id|+1': 3,
        'list|1-10': [{
            'id|+1': 3
        }]
    }]
});
console.log(JSON.stringify(data, null, 4))