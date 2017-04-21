# node端测试package模板


- fecs - 代码检查
- mocha - 单元测试
- chai - 断言
- sinon - 测试桩
- sinon-chai
- istanbul - 代码覆盖率
- babel - 编译器

```json
{
  "name": "",
  "version": "1.0.0",
  "description": "",
  "main": "lib/index.js",
  "scripts": {
    "check": "fecs check src/ test/ --reporter=baidu",
    "compile": "babel src/ -d lib/",
    "watch": "npm run compile -- --watch",
    "prepublish": "npm run compile",
    "test:watch": "npm run test -- --watch",
    "test:cov": "istanbul cover node_modules/mocha/bin/_mocha -- --compilers js:babel-register -t 5000 --recursive  -R spec test/",
    "test": "mocha --compilers js:babel-register --reporter spec --timeout 5000 --recursive test/"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "contributors": [
  ],
  "author": "xuexb",
  "keywords": [
    "urlpath"
  ],
  "license": "MIT",
  "bugs": {
    "url": ""
  },
  "homepage": "",
  "devDependencies": {
    "babel-cli": "6.x.x",
    "babel-plugin-add-module-exports": "^0.2.1",
    "babel-plugin-transform-runtime": "6.x.x",
    "babel-preset-es2015": "6.x.x",
    "babel-preset-stage-0": "6.x.x",
    "babel-preset-stage-3": "6.x.x",
    "chai": "^3.5.0",
    "fecs": "^1.2.2",
    "istanbul": ">=1.0.0-alpha.2",
    "mocha": "^3.2.0",
    "sinon": "^2.1.0",
    "sinon-chai": "^2.9.0"
  },
  "dependencies": {
    "babel-runtime": "6.x.x"
  }
}

```

### .babelrc 配置

```json
{
    "presets": [
      "es2015",
      "stage-0",
      "stage-3"
    ],
    "plugins": [
      "transform-runtime",
      "add-module-exports"
    ]
}
```