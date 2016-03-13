# JSLite

首先赞下整个作者的出发点，以为web前端标准化做贡献。其实我也想做下贡献，刚看了下`JSLite`，感觉可以有如下的调整（当然只是个人想法）：

1. 全部依赖应该放到`devDependencies`里，因为咱在生产环境下咱可以不依赖任何包
1. 不依赖全局的任何包（比如gulp），开发者可以方便的`npm install`然后进行开发
1. 使用`npm run xx`进行命令行工具管理，比如`npm run build, npm run watch, npm run release`等，其实跟上条相对应，不用全局就可以用这个了([npm scripts](https://docs.npmjs.com/misc/scripts))
1. 使用`karma`进行环境测试，使用`jasmine`进行单元测试（只是个例子，也可以使用`mocha`），因为这个`karma`可以跑出整个代码的覆盖率，还可以做到集成测试只跑`phantomjs`，本地还可以跑别的真实的浏览器来测，么么哒～
1. 统一整个代码风格并给出`docs`以方便别人pr


> 如果使用`es6`开发，也跟以上没有任何冲突，可以同时进行

这是我一个使用`karma`跑`phantomjs`的例子：[@xuexb zbfe/hash.js](https://github.com/zbfe/hash.js)

## 遇到的问题

经我简单的写了个test case发现JSLite是使用`gulp-umd`打的`wrap`，但我们测试应该要跑真正的源码（是指打包前），然后发现`JSLite.js`里的`JSLite`变量跟`window.JSLite`变量有冲突，导致test case不通过，目前我是使用在`JSLite.js`再包一层`function`解决。


## 我已经做出相关的case

代码在：[@xuexb/JSLite:dev](https://github.com/xuexb/JSLite/tree/dev)

- [x] 使用`karma`测试
- [ ] 使用`npm run`方式，目前发现运行`gulp`时报错，待解决
- [ ] 代码覆盖率，目前我没有去开启`coveralls`

---

首先作为一个前端，真心的希望`JSLite`越做越好！