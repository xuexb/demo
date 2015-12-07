# 异步分页

```js
/**
 * 异步分页
 * @author xieliang
 * @email admin@xuexb.com
 * @requires event.js,ajaxPage.css,artTemplate.js,jQuery.js
 *
 * @example
 *     1, var demo = new AjaxPage({
                url: '/api.php',
                offsetTop: 20,
                elem: '#J-test',
                tpl: $('#J-tpl').html(),
                filterData: function(res){
                    return {
                        items: res.items,
                        type: 1
                    }
                }
            }).request();
            demo.request({
                type: this.getAttribute('data-type'),
                page: 1
            });
        2, demo.on('success', function(res){});
 */
```

[ajaxPage.js](./ajaxPage.js)