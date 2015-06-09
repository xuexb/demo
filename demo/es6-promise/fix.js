/**
 * promise的相关操作 - fix
 * @author xieliang
 * @fix
 *     new Promise
 *     Promise.getDefer,
 *     Promise.all
 *     Promise.resolve
 *     Promise.reject
 */

'use strict';

function Promise(callback) {
    var self = this;

    //制作一个队列
    self.__data = {
        resolve: [],
        reject: [],
    }

    //延迟下执行,为了让后续的then绑定上
    if ('function' === typeof callback) {
        setTimeout(function() {
            callback(function(param) {
                self.resolve(param);
            }, function(param) {
                self.reject(param);
            });
        });
    }
}

/**
 * 执行成功回调
 */
Promise.prototype.resolve = function(param) {
    var self = this,
        i = 0,
        data = self.__data.resolve,
        len = data.length;

    //拿成功回调返回的值来当参数执行
    for (; i < len; i++) {
        param = data[i].call(self, param);
    }

    //清空队列
    return self.clear('resolve');
}

/**
 * 执行错误回调
 */
Promise.prototype.reject = function(param) {
    var self = this,
        data = self.__data.reject.shift();

    //错误时候只取第一个
    data.call(self, param);

    //清空队列
    return self.clear('reject');
}

/**
 * then
 * @param  {function} resolve 成功回调
 * @param  {function} reject  错误回调
 * @return {self}
 */
Promise.prototype.then = function(resolve, reject) {
    var self = this;

    //如果有成功则追加
    if ('function' === typeof resolve) {
        self.__data.resolve.push(resolve);
    }

    //如果有错误则追加
    if ('function' === typeof reject) {
        self.__data.reject.push(reject);
    }

    return self;
}

/**
 * catch
 * @param  {function} reject  错误回调
 * @return {self}
 */
Promise.prototype.catch = function(reject) {
    var self = this;

    //错误追加
    if ('function' === typeof reject) {
        self.__data.reject.push(reject);
    }

    return self;
}

/**
 * 清除队列
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Promise.prototype.clear = function(name) {
    var self = this;

    if (name === 'resolve') {
        self.__data.resolve = [];
    } else if (name === 'reject') {
        self.__data.reject = [];
    } else {
        self.clear('resolve').clear('reject');
    }

    return self;
}

/**
 * all Promise
 */
Promise.all = function(data) {
    var complete = 0,
        len = data.length,
        arr = [],
        i = 0,
        error = false,
        defer;

    defer = new Promise();

    for (; i < len; i++) {
        data[i].then(function(param) {
            if (error === false) {
                complete += 1;
                arr.push(param);
                if (complete === len) {
                    defer.resolve(arr);
                }
            }
        }, function(param) {
            if (error === false) {
                error = true;
                defer.reject(param);
                defer.resolve();
                defer.clear();
            }
        });
    }

    return defer;
}

/**
 * 获取一个defer
 * @return {object}
 */
Promise.getDefer = function() {
    var defer = {};

    defer.promise = new Promise(function(resolve, reject) {
        defer.resolve = resolve;
        defer.reject = reject;
    });

    return defer;
}



// var arr = [];
// //success
// new Array(10).join(',').split(',').forEach(function(val, index) {
//     arr.push(new Promise(function(resolve, reject) {
//         setTimeout(function() {
//             resolve(index);
//             // console.log('1:' + index);
//         }, index * 100);
//     }));
// });
// new Array(10).join(',').split(',').forEach(function(val, index) {
//     arr.push(new Promise(function(resolve, reject) {
//         setTimeout(function() {
//             reject(index);
//             // console.log('2:' + index);
//         }, index * 100);
//     }));
// });
// Promise.all(arr).catch(function(e) {
//     console.log(e);
// }).then(function(data) {
//     console.log('success:', data);
// }, function(data) {
//     console.log('error:', data);
// });


// var arr = [];
// //success
// new Array(10).join(',').split(',').forEach(function(val, index) {
//     arr.push(new Promise(function(resolve, reject) {
//         setTimeout(function() {
//             resolve(index);
//         }, index * 100);
//     }));
// });
// Promise.all(arr).then(function(data) {
//     console.log(data);
//     return [1]
// }, function(data) {
//     console.log(data);
// }).then(function(data) {
//     console.log(data);
// });



// function ajax() {
//     var defer = Promise.getDefer();
//     //做点什么异步的事情
//     //结束的时候调用 defer.resolve，比如：
//     setTimeout(function() {
//         defer.resolve('成功'); //这里才是真的返回
//     }, 1000)

//     return defer.promise;
// }
// ajax().then(function(data) {
//     console.log(data);
// }).then(function(data) {
//     console.log(data);
// });


//成功例子
// new Promise(function(resolve, reject) {
//     //做点什么异步的事情
//     //结束的时候调用 resolve，比如：
//     setTimeout(function() {
//         resolve({
//             str: '成功'
//         }); //这里才是真的返回
//     }, 1000)
// }).then(function(data) {
//     return {
//         str: '成功2'
//     }
// }).then(function(data) {
//     console.log('success', data);
// }).then(function(data) {
//     console.log('success', data); //因为前者没有return

//     return 'xx';
// }).then(function(data) {
//     console.log('success', data); //因为前者没有return
// }).catch(function(e) {
//     console.log(e);
// });



//失败
// new Promise(function(resolve, reject) {
//     //做点什么异步的事情
//     //结束的时候调用 resolve，比如：
//     setTimeout(function() {
//         reject({
//             str: '失败'
//         }); //这里才是真的返回
//     }, 1000)
// }).then(function(data) {
//     console.log('success', data);
//     return {
//         str: '成功2'
//     }
// }).then(function(data) {
//     console.log('success', data);
// }).then(function(data) {
//     console.log('success', data);
// }, function(data){
//     console.log('error', data);
//     return data;
// }).catch(function(data){
//     console.log('catch', data);
//     return '';
// }).catch(function(data){
//     console.log('catch', data);
//     return '';
// });