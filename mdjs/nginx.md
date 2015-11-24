# nginx代理

推荐使用`nginx`代码静态文件，比如文档内有大量`html, css, js`文件，可先通过`nginx`代理访问，当文件不存在时（`mdjs`内置资源就不在文档内存在）、`.md`文件结束时代码到`node`层面，达到优化的功能，更可以解决`hostname`问题

`node`监听`8088`端口

```js
// index.js
'use strict';

var Mdocjs = require('mdjs');

new Mdocjs({
    port: 8088
});
```

`nginx`监听`80`并绑定`hostname`

```conf
server {
    listen       80;
    server_name www.demo.com;

    # node的端口
    set $node_port 8088;

    # 根目录
    root /home/demo/;

    # 保护index.js源
    location = /index.js {
        return 403;
    }

    # 如果文件不存在代理到node.js上
    if ( !-f $request_filename ){
        rewrite (.*) /node.js;
    }

    # 代理所有的md代理到node.js上
    location ~ \.md$ {
        rewrite (.*) /node.js;
    }

    # 监听node.js并转发
    location = /node.js {
        #proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://127.0.0.1:$node_port$request_uri;
        proxy_redirect off;
    }
}
```