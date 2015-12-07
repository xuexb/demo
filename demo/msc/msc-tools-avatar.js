/**
 * 上传头像插件, 依赖fullavatareditor
 * @author xieliang
 * @email xieyaowu@meishichina.com
 *
 * @鸣谢 http://www.fullavatareditor.com/
 *
 * @memberOf msc.tools
 * @namespace msc.tools.avatar
 *
 * @param {object} config 配置参数
 * @param {string} config.id 替换容器选择器,由于要给 swf 使用, 不得带#
 * @param {number} config.width=窗口的宽 容器宽
 * @param {number} config.height=容器的高 容器高
 * @param {object} config.data 配置,这个配置将直接影响 swf 的调用
 * @param {string} config.data.id 这个swf的id
 * @param {string} config.version flash最低版本
 * @param {function} config.success 成功回调
 *
 * @return {object} 当前实例
 *
 *
 * @example
 * 		1, 
 * 			swfobject.addDomLoadEvent(function() {
		        msc.tools.avatar({
		            id: "swfContainer", //容器
		            width: 850,
		            height: 430,
		            data: {
		                tab_visible: false,
		                upload_url: msc.tools.getAjaxUrl({
		                    ac: "user",
		                    op: "set_avatar"
		                }),
		                avatar_sizes: "200*200|120*120|48*48",
		                avatar_sizes_desc: "200*200像素|120*120像素|48*48像素"
		            },
		            success: function(res) {
		                if (res.code === 3) {
		                    if (res.type == 0) { //摄像头已准备就绪且用户已允许使用。
		                    } else if (res.type == 1) {
		                        dialog.warning("请允许使用摄像头");
		                    } else {
		                        dialog.warning("摄像头被占用！");
		                    }
		                } else if (res.code === 5) {
		                    if (res.type === 0) {
		                        dialog.success("上传成功");
		                        $("#J_img").attr("src", $.isArray(res.content.avatarUrls) ? res.content.avatarUrls[0] : res.content.avatarUrls)
		                    } else {
		                        dialog.error("上传失败");
		                    }
		                }
		            }
		        });

		    });
 */
(function($, msc) {
	var tools = msc.tools;
	count = 0,
	swf_url = 'http://static.meishichina.com/v6/fullAvatarEditor/fullAvatarEditor.swf',
	express_url = 'http://static.meishichina.com/v6/fullAvatarEditor/expressInstall.swf',
	params = {
		menu: 'true',
		scale: 'noScale',
		allowFullscreen: 'true',
		allowScriptAccess: 'always',
		wmode: 'transparent'
	}

	tools.avatar = function(config) {
		return new Class(config);
	}


	function Class (config){
		var swf;

		//合并参数
		config = $.extend(true, {

			width: 600,
			height: 400,
			data: {
				id: 'msc_avatar_' + (count++)
			},
			version: '10.1.0',
			success: $.noop
		}, config || {});


		if (!config.id) {
			return swf;
		}


		//处理url
		$.each(config.data, function(key) {
			if (key === 'upload_url' || key === 'src_url') { //如果包括url
				config.data[key] = encodeURIComponent(config.data[key]);
			}
		});

		// console.log(config)

		swfobject.embedSWF(
			swf_url, //flash文件的路径
			config.id, //替换容器
			config.width, //宽
			config.height, //高
			config.version, //版本
			express_url, //安装swf
			config.data, //参数
			params, //swf配置 
			{
				id: config.data.id,
				name: config.data.id
			}, //属性
			function(e) {
				swf = e.ref;
				swf.eventHandler = function(json) {
					config.success.call(swf, json);
				}
			}
		);

		return swf;
	}

}(jQuery, msc));