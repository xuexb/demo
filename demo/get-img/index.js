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

const request = require('request');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const defaults = {
    bingfa: 5,
    uploadPath: './upload',
    timeout: 1000 * 5
};

class Caiji extends EventEmitter {
    constructor(data = [], options = {}) {
        super();

        // 配置
        this.options = Object.assign({}, defaults, options);

        // 当前运行数
        this.currentLength = 0;

        this.ing = {};

        // 错误数据
        this.error = [];

        // 成功数据
        this.success = [];

        // 当前数据
        this.data = data;

        this.bind();
    }

    /**
     * 绑定事件
     */
    bind() {
        this.on('queue.in', data => {
            this._getData(data);
        });

        this.on('down.start', ({id, url}) => {
            console.log(`开始下载, id: ${id}, url: ${url}`);

            // 打上标识, 正在下载
            this.ing[id] = 1;
        });

        this.on('down.error', data => {
            this.error.push(data);
            console.log(`出错了, id: ${data.id}, code: ${data.code}, msg: ${data.msg}, id: ${data.id}, url: ${data.url}`);
        });

        this.on('down.success', data => {
            this.success.push(data);
            console.log(`下载成功, id: ${data.id}, url: ${data.url}`);
        });

        this.on('complete', () => {
            console.log(`辛苦了, 完成了, 一共下载成功${this.success.length}个, 下载失败${this.error.length}个~`);
        });

        this.on('down.complete', ({id}) => {
            delete this.ing[id];

            this.currentLength -= 1;

            if (this.data.length > 0) {
                this._setQueue();
            }
            else if (this.data.length === 0 && Object.keys(this.ing).length === 0) {
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

    /**
     * 获取文件名
     *
     * @param {string} url 图片链接
     *
     * @return {string}
     */
    _getFileName(url) {
        let data = path.parse(url);
        return data.base || (Date.now() + data.ext);
    }

    /**
     * 获取上传路径
     *
     * @param  {string} url 图片链接
     *
     * @return {string}
     */
    _getUploadPath(url) {
        return path.resolve(this.options.uploadPath, this._getFileName(url));
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
                code: err.statusCode || 500,
                msg: err,
                url,
                id
            });

            this.emit('down.complete', {
                url,
                id
            });
        }).on('response', res => {
            if (res.statusCode === 200) {
                let filepath = this._getUploadPath(url);

                request.get({
                    url: url,
                    timeout: this.options.timeout
                }).on('response', () => {
                    this.emit('down.success', {
                        url,
                        id
                    });
                    this.emit('down.complete', {
                        id,
                        url
                    });
                }).on('error', err => {
                    this.emit('down.error', {
                        code: 3,
                        msg: '下载失败',
                        url,
                        id
                    });
                    this.emit('down.complete', {
                        url,
                        id
                    });
                }).pipe(fs.createWriteStream(filepath));
            }
            else {
                this.emit('down.error', {
                    code: res.statusCode,
                    msg: '返回状态码不是200',
                    url,
                    id
                });
                this.emit('down.complete', {
                    url,
                    id
                });
            }
        });
    }

    _setQueue() {
        let i = 0;
        let len = this.options.bingfa - this.currentLength;

        if (len > this.data.length) {
            len = this.data.length;
        }

        // console.log('len', len);

        for (; i < len; i++) {
            this.currentLength += 1;
            let {url, id} = this.data.shift();
            // console.log(i, '添加队列', Object.keys(this.ing).length, this.currentLength);
            this.emit('queue.in', {
                url,
                id
            });
        }
    }
}

module.exports = Caiji;
