/**
 * @file 抓取图片并下载
 * @author xieyaowu
 * @event
 *     queue.in - 添加到队列
 *     down.start - 开始下载
 *     down.success - 下载成功
 *     down.error - 下载失败
 *     down.complete - 下载完成
 *     complete - 任务完成
 */

var request = require('request');
var EventEmitter = require('events');
var fs = require('fs');

const defaults = {
    bingfa: 10,
    timeout: 1000 * 5
};

class Caiji extends EventEmitter {
    constructor(data = [], options = {}) {
        super();

        // 配置
        this.options = Object.assign({}, defaults, options);

        // 当前运行数
        this.currentLength = 0;

        // 错误数据
        this.error = {};

        // 成功数据
        this.success = {};

        // 当前数据
        this.data = data;

        this.bind();
    }

    /**
     * 绑定事件
     */
    bind() {
        this.on('queue.in', data => {
            this.currentLength += 1;
            this._getData(data);
        });

        this.on('down.start', ({id}) => {
            console.log(`开始下载, id: ${id}`);
        });

        this.on('down.error', data => {
            console.log(`出错了, id: ${data.id}, code: ${data.code}, msg: ${data.msg}`);
        });

        this.on('down.success', data => {
            console.log(`下载成功, id: ${data.id}`);
        });

        this.on('complete', () => {
            console.log('辛苦了, 完成了');
        });

        this.on('down.complete', () => {
            if (this.data.length) {
                this._setQueue();
            }
            else {
                this.emit('complete');
            }
        });
    }

    /**
     * 运行
     */
    run() {
        this._setQueue();
    }

    _getExt(contentType) {
        return contentType.indexOf('image/') < 0 ? 'jpg' : contentType.replace(/.+\//, '');
    }

    /**
     * 请求下载图片数据
     *
     * @param  {string} options.url 链接
     * @param  {number} options.id  索引
     */
    _getData({url, id}) {
        // 触发开始下载
        this.emit('down.start', {
            url,
            id
        });

        request.get({
            url: url,
            timeout: this.options.timeout
        }).on('error', err => {
            this.emit('down.error', {
                code: 1,
                msg: err,
                url,
                id
            });

            this.emit('down.complete');
        }).on('response', res => {
            if (res.statusCode === 200) {
                let ext = this._getExt(res.headers['content-type']);

                request.get({
                    url: url,
                    timeout: this.options.timeout
                }).on('response', () => {
                    this.emit('down.success', {
                        url,
                        id
                    });
                    this.emit('down.complete');
                }).on('error', err => {
                    this.emit('down.error', {
                        code: 3,
                        msg: '下载失败',
                        url,
                        id
                    });
                    this.emit('down.complete');
                }).pipe(fs.createWriteStream(`${id}.${ext}`));
            }
            else {
                this.emit('down.error', {
                    code: 2,
                    msg: '返回状态码不是200',
                    url,
                    id
                });
                this.emit('down.complete');
            }
        });
    }

    _setQueue() {
        let i = 0;
        let len = this.options.bingfa - this.currentLength;

        if (len > this.data.length) {
            len = this.data.length;
        }

        for (; i < len; i++) {
            let {url, id} = this.data.shift();
            this.emit('queue.in', {
                url,
                id
            });
        }
    }

}

let app = new Caiji([
    {
        url: 'http://www.myjsblog.com/wp-content/themes/Kratos/images/random/1.jpg',
        id: 1
    },
    {
        url: 'http://www.myjsblog.com/wp-content/themes/Kratos/images/random/2.jpg',
        id: 2
    },
    {
        url: 'http://www.myjsblog.com/wp-content/themes/Kratos/images/random/33.jpg',
        id: 3
    },
    {
        url: 'http://www.myjsblog.com/wp-content/themes/Kratos/images/random/4.jpg',
        id: 4
    },
    {
        url: 'http://www.myjsblog.com/wp-content/themes/Kratos/images/random/5.jpg',
        id: 5
    }
]);
app.run();
