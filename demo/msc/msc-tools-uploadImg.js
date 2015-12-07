/**
 * 图片批量上传
 * @author xieliang
 * @email   xieyaowu@meishichina.com
 * @todo
 *     1, 文件去重
 *     2, 图片预览
 *     3, 内存优化, 现有内存泄漏的问题, 因为在 实例上引用了dialog, 而dialog.befo里又有实例, 虽说用proxy代理了, 但感觉还是不够好
 * @memberOf msc.tools
 * @namespace msc.tools.uploadImg
 * @description 批量图片上传插件, 依赖swfupload
 * @example
 *     1, msc.tools.uploadImg({
 *         url:"后端连接",
 *         success: function(data){
 *             var str = '', i = 0, len = data.length;
 *             for(;i<len;i++){
 *                 data[i].name;//图片名称
 *                 data[i].src;//图片连接
 *                 data[i].size;//图片大小
 *             }
 *         },
 *         error: function(){//如果用户关闭, 或者 取消
 *         }
 *     });
 */
(function($, msc) {
    var DIALOG = msc.ui.dialog,
        NOOP = $.noop,
        BASE = 'http://static.meishichina.com/v6/img/uploadImg/',
        PROXY = $.proxy,
        uploadImg;


    uploadImg = msc.tools.uploadImg = function(config) {
        if (DIALOG.get("uploadImg")) {
            return false;
        }
        if ("function" === typeof config) {
            config = {
                success: config
            }
        }
        config = $.extend(true, {
            success: NOOP,
            url: '',
            // name:'msc_upload',
            // data: {},
            error: NOOP
        }, config || {});

        return new Class(config);
    }


    /**
     * 格式化文件大小, 输出成带单位的字符串, by baidu
     * @param {Number} size 文件大小
     * @param {Number} [pointLength=2] 精确到的小数点数。
     * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位数组。从字节，到千字节，一直往上指定。如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
     * @example
     *     console.log( formatSize( 100 ) );    // => 100B
     *     console.log( formatSize( 1024 ) );    // => 1.00K
     *     console.log( formatSize( 1024, 0 ) );    // => 1K
     *     console.log( formatSize( 1024 * 1024 ) );    // => 1.00M
     *     console.log( formatSize( 1024 * 1024 * 1024 ) );    // => 1.00G
     *     console.log( formatSize( 1024 * 1024 * 1024, 0, ['B', 'KB', 'MB'] ) );    // => 1024MB
     */
    uploadImg.formatSize = function(size, pointLength, units) {
        var unit;

        units = units || ['B', 'K', 'M', 'G', 'TB'];

        while ((unit = units.shift()) && size > 1024) {
            size = size / 1024;
        }

        return (unit === 'B' ? size : size.toFixed(pointLength || 2)) +
            unit;
    }


    function Class(config) {
        this.config = config;
        return this.init();
    }

    /**
     * 初始化类
     */
    Class.prototype.init = function() {
        var self = this,
            dom = self._dom = {};

        //打上状态
        self.status = null; //0弹出了层但未选择图片, 1已经选择了图片, 2正在上传, 3上传暂停了, 4上传完成, 5用户手动取消上传

        //文件大小
        self.fileSize = 0;

        //文件数量
        self.fileLength = 0;

        //成功文件数量
        self.successFileLength = 0;

        //回调使用包
        self._data = {};



        //已经选择的文件队列, 如果已经完成, 里面剩下的将是失败或者错误的
        self.percentages = {};


        //打上弹出层实例
        self.dialog = DIALOG({
            title: self.config.title || '上传图片',
            lock: true,
            id: 'uploadImg',
            content:    '<div class="ui-uploadImg">'+
                            '<div class="ui-uploadImg-list">'+
                                '<div class="ui-webkit-scrollbar">'+
                                    '<ul><li class="last"><div id="spanSWFUploadButton"></div></li></ul>'+
                                '</div>'+
                            '</div>'+
                            '<div class="ui-uploadImg-btn">'+
                                '<div class="left"><a href="#" class="ui-btn-red-2">开始上传</a><a href="javascript:;" class="ui-btn-gray-2">取消</a></div>'+
                                '<div class="right">'+
                                    '<div class="ui-uploadImg-status">...</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>',
            initialize: PROXY(self._initialize, self),
            beforeunload: PROXY(self._beforeunload, self)
        });

        //让关闭按钮消失
        self.dialog._$("close").hide();

        //注册dom
        dom.$wrap = self.dialog._$("content").find(".ui-uploadImg");
        dom.$list = dom.$wrap.find("ul");
        dom.$startBtn = dom.$wrap.find(".ui-btn-red-2");
        dom.$cancelBtn = dom.$wrap.find(".ui-btn-gray-2");
        dom.$statusBar = dom.$wrap.find(".ui-uploadImg-status");

        //注册公共事件
        self._bind();
    }



    /**
     * 注册公共事件, 如 取消按钮,暂停等
     */
    Class.prototype._bind = function() {
        var self = this,
            dom = self._dom,
            dialog = self.dialog;

        dom.$cancelBtn.click(function() {
            dialog.close();
        });

        dom.$startBtn.click(PROXY(self.startUpload, self));


        dom.$list.on("click", "span.delete", function() { //删除
            var that = this,
                $li = $(that).closest("li"),
                id = $li.attr("data-id"),
                api = self.percentages[id];

            //如果上传中不允许删除, todo, 要给dom上标记
            if (self.status === 2) {
                return false;
            }

            if (api) { //如果缓存存在 
                self.fileSize -= api['size'];
                self.fileLength -= 1;

                //删除占用的id
                delete self.percentages[id];
            }

            //处理删除成功的图片
            if(self._data[id]){
                delete self._data[id];
                self.fileLength -= 1;
            } else {
                //从队列里删除
                self.flash.cancelUpload(id, false); // false 为不触发 error
            }


            //如果文件数小于1则说明空了
            if (self.fileLength < 1) {
                self.setState(0);
            } else {
                //说明删除完了错误或者没有上传的
                if (self.successFileLength >= self.fileLength) {
                    self.setState(4);
                }
            }

            self.updateStatus();


            $li.remove();

            $li = null;
            return false;
        });
    }



    /**
     * 开始上传按钮
     */
    Class.prototype.startUpload = function() {
        var self = this,
            status = self.status,
            data;

        if (status === 0) {
            DIALOG.error("请先添加图片");
        } else if (status === 1) { //已经选择了图片
            self.flash.startUpload();
            self.setState(2);
        } else if (status === 2) { //正在上传
            // self.flash.stopUpload();//停止
            // self.setState(3);
            // self.updateStatus();
        } else if (status === 3) { //暂停了
            // self.flash.startUpload();
            // self.setState(2);
        } else if (status === 4) { //完成
            data = [];
            $.each(self._data,function(){//把对象转换成数组
                data.push(this);
            });

            if (self.config.success.call(self, data) !== false) {
                self.config.error = NOOP; //把错误事件重写了
                self.status = 5;
                self.dialog.close();
            }
        }
        return false;
    }


    /**
     * 关闭弹出层前
     */
    Class.prototype._beforeunload = function() {
        var self = this,
            key,
            status = self.status; //状态

        if (status === 0 || status === 5) { //没有选择图片,或者用户强制取消
            self.flash.stopUpload(); //停止
            self.flash.destroy(); //把flash注销了
            self.config.error();
            for (key in self) { //清空实例
                delete self[key];
            }
            return true;
        } else if (status === 1) { //已经选择了图片
            // DIALOG.alert("您当前有" + self.flash.getStats()['files_queued'] + "个图片没有上传, 确定关闭吗", function() {
            DIALOG.alert('此时关闭窗口图片将不会被保存， 确定关闭吗？', function(){
                self.status = 5;
                self.dialog.close();
            }, NOOP);
        } else if (status === 2) { //正在上传
            DIALOG.alert('此时关闭窗口图片将不会被保存， 确定关闭吗？', function() {
                self.status = 5;
                self.dialog.close();
            }, NOOP);
        } else if (status === 3) { //暂停上传

        } else if (status === 4) { //上传成功
            if(self.successFileLength < 1){
                self.status = 5;
                self.config.error = NOOP;
                self.dialog.close();
            } else {
                // DIALOG.alert(["您当前有" + self.successFileLength + "上传成功, 确定关闭吗", "关闭后图片将保存失败"], function() {
                DIALOG.alert('此时关闭窗口图片将不会被保存， 确定关闭吗？', function(){
                    self.status = 5;
                    self.dialog.close();
                }, NOOP);
            }
        } else {

        }

        return false;
    }


    /**
     * 设置上传状态
     * val = ready 选择完文件转备上传
     *
     */
    Class.prototype.setState = function(val) {
        var self = this,
            text,
            className;
        if (self.status !== val) {
            self.status = val;
            text = '开始上传';
            className = 'ui-btn-red-2';

            switch (val) {
                case 0: //空
                    className += ' ui-btn-gray-2';
                    break;
                case 1: //已经选择图片
                    break;
                case 2: //正在上传
                    className += ' ui-btn-gray-2';
                    text = '正在上传';
                    // text = '暂停上传';
                    break;
                case 3: //暂停
                    text = '继续上传';
                    break;
                case 4: //完成
                    text = '完成';
                    break;
                case 5: //用户主动停止
                    break;
                default:
                    break;
            }


            self._dom.$startBtn[0].innerHTML = text;
            self._dom.$startBtn[0].className = className;
        }
    }

    /**
     * 更新状态条
     */
    Class.prototype.updateStatus = function() {
        var text = '',
            self = this,
            status = self.status;

        if (status === 0) {
            text = '请先添加图片';
        } else if (status === 1) { //已经选择了图片
            if (self.successFileLength > 0) { //证明有成功的图片
                if (self.fileLength - self.successFileLength > 0) { //证明新添加有图片
                    text = '一共有' + self.fileLength + '张图片，新添加' + (self.fileLength - self.successFileLength) + '张图片，共' + uploadImg.formatSize(self.fileSize);
                } else { //否则是全部都成功了
                    text = '成功上传' + self.fileLength + '张图片';
                }
            } else {
                text = '一共有' + self.fileLength + '张图片，共' + uploadImg.formatSize(self.fileSize);
            }

        } else if (status == 2) { //正在上传
            text = '上传中, 一共 ' + self.fileLength + '张图片, 已经完成' + self.successFileLength + '张图片';
        } else if (status === 4) { //上传完成了
            if (self.fileLength - self.successFileLength > 0) { //证明有失败的
                text = '上传完成, 一共' + self.fileLength + '张图片, 失败' + (self.fileLength - self.successFileLength) + '张图片';
            } else {
                text = '上传完成, 成功上传' + self.fileLength + '张图片';
            }

        }

        self._dom.$statusBar[0].innerHTML = text;
    }

    /**
     * 添加文件后事件
     * this是实例,file参数为添加的文件
     */
    Class.prototype._fileQueued_handler = function(file) {
        var self = this;
        if (self.status === 2) { //如果正在上传中不让添加队列
            DIALOG.warning("一会再选择吧");
        } else {
            //缓存上
            self.percentages[file.id] = file;

            //追加大小
            self.fileLength += 1;
            self.fileSize += file.size;

            self.addFile(file);
            self.setState(1);
            self.updateStatus();
        }
    }

    /**
     * 添加图片到页面
     */
    Class.prototype.addFile = function(file) {
        var self = this,
            dom = self._dom,
            str = '';

        str += '<li id="J_upload_item_' + file.id + '" data-id="' + file.id + '"><div class="detail">';
        str += '<div class="pic"><img src="'+ BASE+'placeholder.jpg" alt="' + file.name + '" width="140" height="140"></div>';
        str += '<div class="subtitle">' + file.name + '</div>';
        str += '<div class="subtools"><span class="delete">删除</span></div>';
        str += '<div class="subprogress"></div>';
        str += '</div></li>';

        dom.$list.find("li.last").before(str);
    }

    /**
     * 上传成功flash回调, this为当前实例
     */
    Class.prototype._success_handler = function(file, res, a) {
        var self = this,
            id = file.id,
            flash = self.flash,
            $li = $("#J_upload_item_" + id),
            $subtools = $li.find(".subtools"),
            str;

        //容错
        try{
            res = $.parseJSON(res);
        } catch(e){
            res = {
                error: -1,
                msg : '返回值错误'
            }
        }

        if (res.error === 0) {//成功
            $subtools.append('<span class="success">成功</span>');

            //写入图片地址
            $li.find("img").attr("src", res.data.src);


            //计数
            self.fileSize -= file.size;
            self.successFileLength += 1;

            //删除缓存
            delete self.percentages[file.id];

            //追加回调使用数据包
            self._data[file.id] = {
                src: res.data.src,
                size: file.size,
                name: file.name
            };
        } else if (res.error === -1) { //类型错误
            str = '图片类型错误';
        } else if (res.error === -2) { //超出大小
            str = '图片过大';
        } else if (res.error === -3){ //文件为空
            str = '文件为空';
        }
            

        if (str) {
            $subtools.append('<span class="error">' + str + '</span>');
            $li.find("img").attr("src", BASE +"error.jpg");
            str = null;
        }

    }

    Class.prototype._error_handler = function(file) {
        var $li = $("#J_upload_item_" + file.id),
            $subtools = $li.find(".subtools")

        $subtools.append('<span class="error">上传失败</span>');
        $li.find("img").attr("src", BASE +"error.jpg");
    }

    Class.prototype._complete_handler = function(file) {


        var self = this;


        //如果为正在上传 且有预备文件则上传
        if (self.status === 2 && self.flash.getStats()['files_queued'] > 0) {
            self.flash.startUpload();
        } else {
            self.flash.getStats()['files_queued'] < 1 && self.setState(4); //上传完成了
        }


        //不管成功与失败
        $("#J_upload_item_" + file.id + " .subprogress").fadeOut();

        self.updateStatus();
        // console.log("完成", file)
    }

    Class.prototype._progress_handler = function(file, bytesLoaded, bytesTotal) {
        $("#J_upload_item_" + file.id + " .subprogress").stop().animate({
            width: Math.ceil((bytesLoaded / bytesTotal) * 100) + "%"
        }, 200);
    }



    /**
     * 弹出层初始化后
     */
    Class.prototype._initialize = function() {
        var self = this,
            config = self.config;

        self.flash = new SWFUpload({ //定义参数配置对象
            upload_url: config.url, //"/ajax/ajax.php?ac=user&op=xl_test_upload",
            flash_url: "http://static.meishichina.com/v6/swfupload/swfupload.swf",
            file_post_name: config.name || "msc_upload",
            post_params: config.data,

            file_types: "*.jpg;*.gif;*.png;*.jpeg",
            // file_size_limit: "1024",
            // file_upload_limit: 10,
            // file_queue_limit: 2,


            button_placeholder_id: "spanSWFUploadButton",
            button_width: 140,
            button_height: 140,
            button_cursor: SWFUpload.CURSOR.HAND,
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,

            //事件
            file_queued_handler: PROXY(self._fileQueued_handler, self),
            upload_success_handler: PROXY(self._success_handler, self),
            upload_error_handler: PROXY(self._error_handler, self),
            upload_complete_handler: PROXY(self._complete_handler, self),
            upload_progress_handler: PROXY(self._progress_handler, self)

        }); //实例化一个SWFUpload，传入参数配置对象

        setTimeout(function() {//为了处理没有初始化的时候得不到dom报错
            self.setState(0);
            self.updateStatus();
        });
    }


}(jQuery, msc));