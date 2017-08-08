# chrome headless 截图

```
# alias
chrome='/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
chrome-canary='/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
chromium=/Applications/Chromium.app/Contents/MacOS/Chromium

# 运行环境
chrome --headless --remote-debugging-port=9222

# 执行截图
node index.js --url https://xuexb.com --delay 2000 --viewportWidth 1000 --viewportHeight 1000
```

[index.js](./index.js)