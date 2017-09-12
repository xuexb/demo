var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: '110.57.148.71:9200', //服务 IP 和端口
    // log: 'trace' //输出详细的调试信息
});

let keyword = '缩写';

//promise
client.search({
    index : 'blog',
    type : 'post',
    from : 0,
    query : { 
        dis_max : { 
            queries : [
                {
                    match : {
                        title : { 
                            query : keyword, 
                            minimum_should_match : '50%',
                            boost : 4,
                        }
                    } 
                }, {
                    match : {
                        content : { 
                            query : keyword, 
                            minimum_should_match : '75%',
                            boost : 4,
                        }
                    } 
                }, {
                    match : {
                        tags : { 
                            query : keyword, 
                            minimum_should_match : '100%',
                            boost : 2,
                        }
                    } 
                }, {
                    match : {
                        slug : { 
                            query : keyword, 
                            minimum_should_match : '100%',
                            boost : 1,
                        }
                    } 
                }
            ],
            tie_breaker : 0.3
        }
    },
    highlight : {
        // pre_tags : ['<b>'],
        // post_tags : ['</b>'],
        fields : {
            // title : {},
            _all : {},
        }
    }
}).then(function(data) {
    console.log('result:', JSON.stringify(data, null, 4));
}, function(err) {
    console.log('error:', err);
});

// client.search({
//     index : 'blog',
//     type : 'post',
//     q : '写',
// }).then(function(data) {
//     console.log('result:', JSON.stringify(data, null, 4));
// }, function(err) {
//     console.log('error:', err);
// });

// client.indices.create({index : 'blog'});


// client.indices.putMapping({
//     index : 'blog',
//     type : 'post',
//     body : {
//         post: {
//             properties: {
//                 title: {
//                     type: 'string',
//                     term_vector: 'with_positions_offsets',
//                     analyzer: 'ik_syno',
//                     search_analyzer: 'ik_syno',
//                 },
//                 content: {
//                     type: 'string',
//                     term_vector: 'with_positions_offsets',
//                     analyzer: 'ik_syno',
//                     search_analyzer: 'ik_syno',
//                 },
//                 slug: {
//                     type: 'string',
//                 },
//                 tags: {
//                     type: 'string',
//                     index : 'not_analyzed',
//                 },
//                 update_date: {
//                     type : 'date',
//                     index : 'not_analyzed',
//                 }
//             }
//         }
//     }
// });

// client.index({
//     index : 'blog',
//     type : 'post',
//     id : '100',
//     body : {
//         title : '什么是 JS？',
//         slug :'what-is-js',
//         tags : ['JS', 'JavaScript', 'TEST'],
//         content : 'JS 是 JavaScript 的缩写！',
//         update_date : '2015-12-15T13:05:55Z',
//     }
// })