# node端测试package模板


- fecs - 代码检查
- mocha - 单元测试
- chai - 断言
- chai-as-promised
- sinon - 测试桩
- sinon-chai
- istanbul - 代码覆盖率

```json
{
  "name": "",
  "version": "1.0.0",
  "description": "",
  "main": "lib/index.js",
  "scripts": {
    "lint": "fecs check src/ test/ --reporter=baidu --rule",
    "precommit": "npm run lint",
    "commitmsg": "validate-commit-msg",
    "test:watch": "npm run test -- --watch",
    "test:cov": "istanbul cover node_modules/mocha/bin/_mocha -- -t 5000 --recursive  -R spec test/",
    "test": "mocha --reporter spec --timeout 5000 --recursive test/"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "contributors": [
  ],
  "author": "xuexb <fe.xiaowu@gmail.com>",
  "keywords": [
    "urlpath"
  ],
  "license": "MIT",
  "bugs": {
    "url": ""
  },
  "homepage": "",
  "devDependencies": {
    "chai-as-promised": "*",
    "chai": "^3.5.0",
    "fecs": "^1.2.2",
    "istanbul": "*",
    "mocha": "^3.2.0",
    "sinon": "^2.1.0",
    "sinon-chai": "^2.9.0"
  }
}

```
