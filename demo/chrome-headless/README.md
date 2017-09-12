# 指读取xml数据并操作js后截图

> 这里只是个思路, 跑不起来, 依赖xml数据

```
./README.md - 说明文档
./src/                      - 源码
./data/                     - xml数据存放
./output/                   - 产出目录
./src/index.js              - 入口文件, 包括所有配置, 抓取链接、生成路径、生成张数、间隔等
./src/checkOptions.js       - 检查配置
./src/getXmlData.js         - 获取xml数据  - 这里包括白名单, 主要针对case by case处理
./src/saveImage.js          - 保存图片
./src/render.js             - promise版本截图
./src/moveImage.js          - 移动图片, 主要是后置处理, 一般不用
```

### 安装

```
# osx下添加 alias, 如果是 windows / linux请自动搜索: 安装chrome headless
chrome='/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
chrome-canary='/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
chromium=/Applications/Chromium.app/Contents/MacOS/Chromium

# 安装依赖
npm install
```

### 运行

```
# 开始 chrome CLI
chrome --headless --remote-debugging-port=9222

# 启动截图
node src/index.js
```

### 机制

1. 使用`Promise`流机制, 单个文件只做单个的功能, 并且参数会往下个流透传, 以方便让下个流使用
2. 单个流产出的数据, 会在往`options`参数内合并, 比如`./getXmlData.js`获取了xml数据, 处理后合并到`options.data`中, 后续直接用该参数