# 称动端滑屏插件

> 谢耀武 hi:xuexb xieyaowu@baidu.com

## 说明描述

* 暴露在`A.ui.swipeXW`上
* 插件不集成`css`，需要自己定义
* li为纵向排列，js控制ul的X轴来滑动
* 为了更好的用户体验，且保持在加载js前页面排版不变形，需要设置ul的最大高并益出隐藏，设置li为宽100%，并左浮动，这样可以保证加载前不变形，然后插件会在初始化时设置ul为10000px以让li可纵型排列
* 如果页面分页不够时建议不加载js初始化
* 可使用`change`回调来完成导航的高亮等操作
* 窗口`resize`的时候会自动触发滑屏容器可见状态下的`resizeWidth`宽

## demo

[查看](http://github.xuexb.com/demo/swipe/demo.html)
![](http://s.jiathis.com/qrcode.php?url=http://github.xuexb.com/demo/swipe/demo.html)

### css
```
.demo { overflow: hidden; }
.demo ul { overflow: hidden; max-height:xxx; backface-visibility: hidden; perspective: 1000; }
.demo ul li { vertical-align: top; width: 100%; float:left; }
```
注意： `max-height`最大高通常是 `内部元素最大行数`*`内部元素单个行高`

### html
```
.demo>ul>li*n
```
注意： `.demo`为包裹容器，`ul`为滑动容器（该容器在初始化js后会设置很宽以来让`li`可纵向排列），`li`为单屏的包裹容器，`n`为分屏的个数，视场景页定

### js

```js
// demo1 默认 滑动时高亮导航
new A.ui.swipeXW({
    elem: '.demo1 .wa-voiceseason-ctn-swipe',
    change: function(index){
        $('.demo1 .wa-voiceseason-cnt-nav i').removeClass('wa-voiceseason-cnt-nav-current')
            .eq(index).addClass('wa-voiceseason-cnt-nav-current');
    }
});

// demo2 点击外部元素滚动滑屏到索引位置
var demo2 = new A.ui.swipeXW({
    elem: '.demo2 .wa-voiceseason-ctn-swipe',
    change: function(index){
        $('.demo2 .wa-voiceseason-nav-item').removeClass('wa-voiceseason-nav-current')
            .eq(index).addClass('wa-voiceseason-nav-current');
    }
});
$('.demo2 .wa-voiceseason-nav-item').on('click', function(){
    demo2.to($(this).index());
});

// demo3 点击外部元素滚动滑屏到索引位置 并默认加载到第4屏， 这里需要注意的是，由于js在移动端加载慢，建议直接使用模板高亮导航为第4个，而滑屏那里由js控制
var demo3 = new A.ui.swipeXW({
    elem: '.demo3 .wa-voiceseason-ctn-swipe',
    change: function(index){
        $('.demo3 .wa-voiceseason-nav-item').removeClass('wa-voiceseason-nav-current')
            .eq(index).addClass('wa-voiceseason-nav-current');
    },
    index: 3
});
// 执行to，不带参数则是加载到索引位置
demo3.to();
$('.demo3 .wa-voiceseason-nav-item').on('click', function(){
    demo3.to($(this).index());
});
```

## API

### 默认配置

``` js
/**
 * 配置参数
 * @type {Object}
 */
Swipe.defaults = {
    // change回调, 参数1为index,参数2为length,this指向当前实例
    change: function (inex, length) {},
    // 滑屏包裹容器，支持string,elem,Zepto
    elem: null,
    // 动画展现时间，单位ms
    speed: 300,
    // 默认索引，如果不为0可在实例化后调用.to()方法移动到该索引位置
    index: 0
};
```

### resizeWidth

```
/**
 * 重置宽，在窗口resize的时候自动调用，如果页面有变形可手动调用该接口，会判断必须滑屏在可见时才算
 *
 * @return {Object} self
 */
```

### prev
```
/**
 * 上一页，目前如果小于0 则＝0
 *
 * @return {Object} self
 */
```

### next
```
/**
 * 下一页，目前不可超出最大页
 *
 * @return {Object} self
 */
```

### to

```
/**
 * 设置到第几页
 *
 * @description 如果不传参则直接移动到当前索引，常用于resize时重围位置、初始化时设置默认位置
 * @param  {number} index 索引
 * @param  {number} speed 速度
 * @return {Object} self
 */
```

### destroy

```
/**
 * 销毁
 *
 * @return {Object} self
 */
```