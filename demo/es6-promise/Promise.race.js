// 并行
// Promise.all如果里面有Promise失败，则先执行catch方法，在等所有的promise执行完返回
// 只使用 then(success) 和最后添加catch(error)

var arr = [];
new Array(10).join(',').split(',').forEach((val, index) => {
    arr.push(new Promise((resolve, reject) => {
        var time = Math.round(Math.random() * 5000);

        setTimeout(() => {
            console.log('index => ' + index, 'time => ' + time);
            if (Math.round(Math.random()) === 0) {
                reject(index);
            }
            else {
                resolve(index);
            }
        }, time);
    }));
});
Promise.race(arr).then(data => {
    console.log(data, 'resolve');
}).catch(data => {
    console.log(data, 'reject');
}).catch(data => {
    console.log(data, 'reject');
}).then(data => {
    console.log(data, 'resolve');
});