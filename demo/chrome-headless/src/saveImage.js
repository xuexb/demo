/**
 * @file 保存图片
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const render = require('./render');

module.exports = function (options) {
    return new Promise((resolve, reject) => {
        let queue = [];

        options.data.forEach((val, index) => {
            queue.push(function () {
                const data = Object.assign({}, options.renderOptions);

                // 优先处理 options.renderOptions.output, 以让其他参数可使用
                if (typeof data.output === 'function') {
                    data.output = data.output(val, data, index);
                }

                // 处理参数是 function 类型
                Object.keys(data).forEach(key => {
                    if (typeof data[key] === 'function') {
                        data[key] = data[key](val, data, index);
                    }
                });

                return render(data);
            });
        });

        let current = 0;


        // 串行promise, 并行的chrome runtime搞不定
        let exec = () => {
            queue[current]().then(() => {
                current += 1;
                if (current >= queue.length) {
                    resolve(options);
                }
                else {
                    exec();
                }
            }).catch(reject);
        };

        if (queue.length) {
            console.log(`一共 ${options.data.length} 个数据, 开始抓取吧, 去喝杯咖啡?`);
            exec();
        }
        else {
            console.log('没有匹配到数据额~');
        }
    });
};
