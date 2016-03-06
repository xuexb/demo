# 使用babel5.x开发es6

> 先学babel5.x，因为6.x的api改变很大

## 安装过程

### 创建项目目录

先创建一个测试的目录，如：c:/xx/

### 创建配置文件

在需要编译的目录里创建`package.json`，这个是npm包配置文件，可以管理一些依赖的包，如：c:/xx/package.json

### 配置文件说明

在配置文件里添加依赖配置 ，如：

```json
{
    // 当前项目名称
    "name": "es6-babel5",

    // 当前项目版本
    "version": "0.0.1",

    // 当前项目描述
    "description": "开发es6，基于babel5",

    // 以上的3个全是Npm包的配置，必有

    // 这个是配置使用`npm run xx`的配置
    "scripts": {
        // 编译命令，是把当前目录`./src/`下的js文件编译到`./lib/`目录下
        "compile": "babel --optional runtime --loose all --stage 0 --modules common src/ --out-dir lib/",

        // 监听文件改变并自动编译，一般开发时使用这个命令
        "watch": "npm run compile -- --watch",

        // 使用fecs检查代码风格
        "check": "fecs check src/"
    },

    // 这个是线上的依赖，比如在线上
    "dependencies": {
        "babel-runtime": "^5.8.20"
    },

    // 这个是开发时的依赖，比如在本地开发时需要编译
    "devDependencies": {
        // 以来babel5.x
        "babel": "5.8.21",

        // 这个是代码检查器，baidu出品的，你如果没有这个需要可以删除
        "fecs": "*"
    }
}
```

> ps: 因为你不需要`fecs`，我删了

### 安装依赖

在项目根目录（也就是包含`package.json`文件的目录）执行`npm i`(`npm install`的别名)安装依赖

### 创建测试文件

创建`src/`目录，该目录是源目录，也就是es6的代码，并在该目录创建测试文件

### 编译

在项目根目录（也就是包含`package.json`文件的目录）执行`npm run compile`编译命令，这个编译命令是自己配置的，也就是`package.json`里的`scripts`里的东东

### 本地实时编译

由于在本地开发中需要实时的写es6代码，并且要实时看效果，每次手动编译不太好，顾有`watch`功能，也就是监听文件修改并编译，执行`npm run watch`，同样该命令也是自己配置的，执行该 命令后node会启用一个线程监听文件的修改，当文件删除、添加、保存时会自动触发当前修改文件的编译


## 小提示

* WARN属于警告，可以忽略，只要没有ERROR就行
* 尽量使用`node 4.x`的最新版
* 后续只要是`node`相关项目就要创建`package.json`配置文件，并且把当前项目使用的依赖配置好，后续一个`npm i`就安装了依赖，非常方便
* 只需要把`package.json`里的`scripts`和依赖记好，后续不管在哪个项目开发，只需要创建配置，然后记住2个编译和监听命令即可
* windows上结束node线程是ctrl+c