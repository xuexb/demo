# 浏览器端测试package模板


- phantomjs - 运行环境
- karma - 自动化测试
- fecs - 代码检查
- mocha - 单元测试
- chai - 断言
- sinon - 测试桩
- sinon-chai
- coverage - 代码覆盖率

```json
{
  "name": "",
  "version": "0.0.1",
  "description": "",
  "main": "src/index.js",
  "scripts": {
    "check": "fecs check src/ test/ --reporter=baidu --rule",
    "test": "karma start karma.conf.js",
    "test:cov": "npm test -- --reporters progress,coverage",
    "test:watch": "npm test -- --auto-watch --no-single-run"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "contributors": [
    {
      "name": "xuexb",
      "email": "fe.xiaowu@gmail.com"
    }
  ],
  "author": {
    "name": "xuexb",
    "email": "fe.xiaowu@gmail.com"
  },
  "license": "MIT",
  "bugs": {
    "url": ""
  },
  "homepage": "",
  "devDependencies": {
    "chai": "^3.5.0",
    "fecs": "^1.2.2",
    "karma": "^1.5.0",
    "karma-chai": "^0.1.0",
    "karma-chai-sinon": "^0.1.5",
    "karma-coverage": "^1.1.1",
    "karma-mocha": "^1.3.0",
    "karma-phantomjs-launcher": "^1.0.4",
    "mocha": "^3.2.0",
    "sinon": "^2.0.0",
    "sinon-chai": "^2.8.0"
  }
}
```

### karma.conf.js

```js
/**
 * @file karma配置
 * @author fe.xiaowu@gmail.com
 */

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // Important: 所有插件必须在此声明
        plugins: ['karma-*'],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        // Important: 下列数组中文件将『逆序载入』
        frameworks: ['mocha', 'chai', 'chai-sinon'],


        // list of files / patterns to load in the browser
        files: [
            'deps/zepto.js',
            'src/index.js',
            'src/debug.js',
            'test/**/*.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // source files, that you wanna generate coverage for 
            // do not include tests or libraries 
            // (these files will be instrumented by Istanbul) 
            'src/**/*.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            'progress'
            // 'coverage'
        ],

        coverageReporter: {
            // specify a common output directory
            dir: '.',
            reporters: [
                // { type: 'html', subdir: 'report-html' },
                {
                    type: 'lcov',
                    subdir: 'coverage'
                },
                {
                    type: 'text-summary'
                }
            ]
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // Note: 如果要调试Karma，请设置为DEBUG
        logLevel: config.LOG_ERROR,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'PhantomJS'
        ],


        // enable / disable watching file and executing tests whenever any file changes
        // Note: 代码改动自动运行测试，需要singleRun为false
        autoWatch: false,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        // 脚本调用请设为 true
        singleRun: true
    });
};
```