首先，我博客自豪的使用`thinkjs`搭建，她是一个基于`nodejs`的`mvc`框架，使用她你可以快速的建立`web`网站~

`thinkjs`自身是支持2套配置，一个是默认的`config.js`配置，一个是调试时才加载的`debug.js`，但在真实使用中发现这2个配置“满足不了我”，比如我代码是开源放在`github`上的，我不可能把数据库密码啥也放上吧。。。于是我就得在主机上`git pull`源码后再修改重要的信息，时间长了更新的时候我就有点烦了，一直得改来改去。于是想加一个配置文件。

大概的思路是启动程序时根据配置文件来判断当前的`hostname`是否有相关的文件，如果有，则读取这个文件并覆盖到`config.js`上，这样就可以上班电脑是一套（读本地的库），家里电脑是一套（读`vps`的库），本是一套（读`vps`的库），服务器上是一套（读自身的库），然后可以把相关的重要文件添加到`git`忽略文件，最终达到上线无压力的目的。

建立`App/Conf/environment.js`文件，内容为：

```js
/**
 * 环境配置
 * @description 根据environment.json里配置的hostname来加载不同的配置文件，并覆盖传来的参数，注意加载的配置文件是基于当前路径下的
 * @author xieliang
 * @path App/Conf/environment.js
 */


'use strict';

var hostname = require('os').hostname();
var data = require('./environment.json');


module.exports = function(config) {
    var fileName, file;

    //遍历所有的配置环境数据
    data.forEach(function(val) {

        if (!Array.isArray(val.name)) {
            val.name = [val.name];
        }

        if (val.name.indexOf(hostname) > -1) {
            fileName = val.config;
        }
    });

    if (fileName) {
        try {
            file = require('./' + fileName);
            Object.keys(file).forEach(function(val) {
                config[val] = file[val];
            });
        } catch (e) {}
    }

    return config;
}
```
建立`App/Conf/environment.json`文件，内容为：
```json
[
    {
        "name": "xxoo-for-mm",
        "config": "xx"
    },
    {
        "name": ["ceshiji", "work"],
        "config": "xxx"
    },
    {
        "name": "online",
        "config": "online"
    }
]
```

`json`配置文件内容是一个数组，只要对象的`name`为当前主机的`hostname`则算匹配成功，支持数组方式

修改`App/Conf/config.js`内容:

```js
'use strict';

var config = {
    ...
};

module.exports = require('./environment')(config);
```
注意：这种方式后请删除`App/Conf/debug.js`文件，因为全走这种方式，即使你开启`APP_DEBUG`也不让程序加载`debug.js`

其实就是程序只加载`config.js`，然后`config.js`里调用环境配置，并覆盖下加载程序。。。

最后感谢@旭的帮助，感谢[@thinkjs](http://thinkjs.org)

- [x] 1
- [] 2