/**
 * 常用操作
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

var fs = require('fs');
var path = require('path');

/**
 * 获取文件内容
 * @param  {string} path 路径
 * @param {Object} res 当失败时幅值
 * @return {Object}
 */
function getFileContentToJson(path, res) {
    var data = res || {};

    if (fs.existsSync(path)) {
        data = fs.readFileSync(path).toString();
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            console.error('解析错误', path);
            data = res || {};
        }
    }

    return data;
}


/**
 * 数组里是否包含
 * @param  {string|number} val 目标
 * @param  {Array} arr 数组
 * @return {Boolean}
 */
function inArray(val, arr){
    var i = 0;
    var len = arr.length;
    var flag = false;

    for(; i<len; i++){
        if(arr[i] === val){
            flag = true;
            break;
        }
    }

    return flag;
}


module.exports = {
    inArray: inArray,
    getFileContentToJson: getFileContentToJson
}