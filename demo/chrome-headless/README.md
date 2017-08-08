# chrome headless 截图

## 依赖

- node 8.x
- chrome

## 环境配置

```
# alias
chrome='/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
chrome-canary='/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
chromium=/Applications/Chromium.app/Contents/MacOS/Chromium
```

## 安装npm包

保存以下内容为`package.json`, 并执行`npm install`: 

```json
{
  "name": "chrome-headless",
  "version": "1.0.0",
  "description": "chrome headless 截图",
  "main": "index.js",
  "dependencies": {},
  "devDependencies": {
    "chrome-remote-interface": "^0.24.3",
    "minimist": "^1.2.0"
  },
  "scripts": {
    "test": "node index.js --url https://xuexb.com --delay 2000 --viewportWidth 1000 --viewportHeight 1000"
  },
  "author": "xuexb <fe.xiaowu@gmail.com>",
  "license": "MIT"
}
```

## 保存以下内容为index.js

```js
const CDP = require('chrome-remote-interface');
const argv = require('minimist')(process.argv.slice(2));
const file = require('fs');

// CLI Args
const url = argv.url || 'https://www.google.com';
const format = argv.format === 'jpeg' ? 'jpeg' : 'png';
const viewportWidth = argv.viewportWidth || 1440;
const viewportHeight = argv.viewportHeight || 900;
const output = argv.output || `output_${Date.now()}`;
const delay = argv.delay || 0;
const userAgent = argv.userAgent;
const fullPage = argv.full;

// Start the Chrome Debugging Protocol
CDP(async function(client) {
    // Extract used DevTools domains.
    const {
        DOM,
        Emulation,
        Network,
        Page,
        Runtime
    } = client;

    // Enable events on domains we are interested in.
    await Page.enable();
    await DOM.enable();
    await Network.enable();

    // If user agent override was specified, pass to Network domain
    if (userAgent) {
        await Network.setUserAgentOverride({
            userAgent
        });
    }

    // Set up viewport resolution, etc.
    const deviceMetrics = {
        width: viewportWidth,
        height: viewportHeight,
        deviceScaleFactor: 0,
        mobile: false,
        fitWindow: false
    };
    await Emulation.setDeviceMetricsOverride(deviceMetrics);
    await Emulation.setVisibleSize({width: viewportWidth, height: viewportHeight});

    // Navigate to target page
    await Page.navigate({
        url
    });

    // Wait for page load event to take screenshot
    Page.loadEventFired(async () => {
        // If the `full` CLI option was passed, we need to measure the height of
        // the rendered page and use Emulation.setVisibleSize
        if (fullPage) {
            const {root: {nodeId: documentNodeId}} = await DOM.getDocument();
            const {nodeId: bodyNodeId} = await DOM.querySelector({
                selector: 'body',
                nodeId: documentNodeId
            });
            const {model: {height}} = await DOM.getBoxModel({
                nodeId: bodyNodeId
            });

            await Emulation.setVisibleSize({width: viewportWidth, height: height});
            // This forceViewport call ensures that content outside the viewport is
            // rendered, otherwise it shows up as grey. Possibly a bug?
            await Emulation.forceViewport({x: 0, y: 0, scale: 1});
        }

        setTimeout(async function() {
            const js = [
            ].join('; ');

            // Evaluate the JS expression in the page.
            const result = await Runtime.evaluate({
                expression: js
            });

            const screenshot = await Page.captureScreenshot({
                format
            });
            const buffer = new Buffer(screenshot.data, 'base64');
            file.writeFile(`${output}.png`, buffer, 'base64', function (err) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log('Screenshot saved');
                }
                client.close();
            });
        }, delay);
    });
}).on('error', err => {
    console.error('Cannot connect to browser:', err);
});
```

### 运行环境

```
chrome --headless --remote-debugging-port=9222
```

### 执行截图

```
node index.js --url https://xuexb.com --delay 2000 --viewportWidth 1000 --viewportHeight 1000
```
