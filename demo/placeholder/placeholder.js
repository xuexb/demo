/**
 * 兼容HTML5placeholder占位
 * @author xieliang
 * @description 依赖mod-common.css里的两行css, 可用于文本框,文本域,密码框等
 * @requires 
 * 		for css
 * 			.ui-placeholder-wrap{position:relative;}
 * 			.ui-placeholder-text{color:#b5b5b5;position:absolute;display:none;}
 * 			
 * @example
 * 		1, new Placeholder("#j-login-name, #j-login-pass");
 * 		2, var a = new Placeholder("#j-login-name, #j-login-pass");
 * 		 	a.destroy();//销毁
 * 		3, var a = Placeholder("#j-login-name, #j-login-pass");//new 不new都一样
 * 		4, new  Placeholder({
 * 			elem: "#j-login-name, #j-login-pass",//或者  $("#id") , document.get...
 * 			css: {
 * 				left: 123,top:333
 * 			}
 * 		});
 */
define(function(require) {
	'use strict';

	var $ = require('./jquery'),
		count = 0,
		isPlaceholder = 'placeholder' in document.createElement('input'),
		nameSpace = 'placeholder',
		prototype;


	//加载css
	// require('./base.css');


	function Placeholder(config) {
		var self = this;

		//如果支持css3
		if (isPlaceholder) {
			return self;
		}


		//如果不是{}
		if (!$.isPlainObject(config)) {
			config = {
				elem: config
			}
		}

		//写入到实例上
		self.config = $.extend({}, Placeholder.defaults, config);


		//注册dom
		self.__dom = {
			elem: $(self.config.elem)
		}

		if (!self.__dom.elem.length) {
			throw new Error('选择器错误');
		}

		return self.init();
	}


	prototype = Placeholder.prototype;



	/**
	 * 初始化
	 * @return {object} 当前实例
	 */
	prototype.init = function() {
		var self = this,
			config = self.config;


		// 遍历
		self.__dom.elem.each(function() {
			var $that = $(this),
				key,
				value = $that.attr(nameSpace);

			//如果没有占位值或者已经加载过
			if (!value || $that.data(nameSpace)) {
				return 1;
			}


			if(config.label){
				key = nameSpace + (count++);
				$that.data(nameSpace, key);
				Placeholder.__create($that, key, value, config);
			} else {
				Placeholder.__bind($that, value);
			}
		});

	}


	/**
	 * 销毁事件+label
	 * @return {object} 当前实例
	 */
	prototype.destroy = function() {
		var self = this,
			config = self.config,
			key;

		if (isPlaceholder) {
			return self;
		}

		self.__dom.elem.each(function() {
			var $that = $(this),
				key = $that.data(nameSpace);

			//移除
			if (key) {
				$that.off('.'+ nameSpace);

				if(config.label){
					$('#' + nameSpace + '-text-' + key).remove();
				}
			}

			$that = null;
		});

		for (key in self) {
			delete self[key];
		}

		return self;
	}


	/**
	 * 绑定事件
	 * @param  {jQuery} $elem 目标对象
	 * @param  {string} value 占位字符
	 */
	Placeholder.__bind = function($elem, value){
		$elem.on('blur.'+ nameSpace, function(){
			if(!this.value){
				this.value = value;
			}
		});

		$elem.on('focus.'+ nameSpace, function(){
			if(this.value === value){
				this.value = '';
			}
		});

		$elem.triggerHandler('blur.'+ nameSpace);
	}


	/**
	 * 内部创建元素, 循环使用, 没有返回值
	 * @param  {object} $elem 目标文本框元素
	 * @param  {number} id    唯一标识
	 * @param  {string} value 占位值
	 * @param {object} config 配置
	 */
	Placeholder.__create = function($elem, id, value, config) {
		var that = $elem[0],
			$label = $('<label />'),
			css = config.css || {},
			position;


		$elem.parent().addClass('ui-placeholder-wrap');

		$label[0].innerHTML = value;

		$label[0].id = nameSpace + '-text-' + id;

		$label[0].className = 'ui-placeholder-text';

		// 设置css
		position = $elem.position();

		css.left = css.left || position.left + 2;
		css.top = css.top || position.top;
		css.paddingLeft = css.paddingLeft || $elem.css('padding-left');
		css.textIndent = $elem.css('text-indent');
		css.fontSize = $elem.css('font-size');

		// css['height'] = $elem.outerHeight();
		if (that.nodeName.toLowerCase() === 'textarea') {
			css.lineHeight = $elem.css('line-height');
			css.paddingTop = $elem.css('padding-top');
		} else {
			css.lineHeight = $elem.outerHeight() + 'px';
		}
		$label.css(css);


		//绑定聚焦
		if (that.id) {
			$label.attr('for', that.id);
		} else {
			$label.click(function() { //点击这个span则
				that.focus();
			});
		}

		//绑定事件
		$elem.on('input.' + nameSpace + ' propertychange.' + nameSpace, function() {
			$label.css('display', this.value ? 'none' : 'block');
		});


		//深深的插入,要在后面插
		$elem.parent().append($label);


		//解决文本框本身就有value值的问题
		setTimeout(function() {
			$elem.triggerHandler('input.'+ nameSpace);
		}, 100);
	}


	/**
	 * 默认值
	 * @type {Object}
	 */
	Placeholder.defaults = {
		elem: '',
		css: {},
		label: true
	}

	return Placeholder;
});