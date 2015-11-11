# es6-demo

> 优雅的开发`es6`

## install

新建`package.json`，内容为：

```json
{
    "name": "es6-demo",
    "version": "0.0.1",
    "description": "es6-demo",
    "scripts": {
        "check": "fecs check src/*.js",
        "build": "babel --loose all --stage 0 --modules common src/ --out-dir dist/",
        "watch": "npm run build -- --watch",
        "start": "node test.js"
    },
    "devDependencies": {
        "babel": "5.8.21",
        "fecs": "^0.4.13"
    }
}
```

执行：

```shell
npm install
```

## 命令

### check

> 使用`fecs`检查`src`代码

```shell
npm run check
```

### build

> `es6`->`es5`，从`src/`编译到`dist/`

```shell
npm run build
```

### watch

> 监听`src/`，修改自动编译`dist/`

```shell
npm run watch
```