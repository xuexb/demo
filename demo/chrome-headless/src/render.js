/**
 * @file promise版本截图
 * @author xuexb <fe.xiaowu@gmail.com>, 部分代码抄自网上
 */

const chromeRemoteInterface = require('chrome-remote-interface');
const file = require('fs');

module.exports = function (options) {
    const url = options.url || 'https://www.google.com';
    const format = options.format === 'jpeg' ? 'jpeg' : 'png';
    const viewportWidth = options.viewportWidth || 1440;
    const viewportHeight = options.viewportHeight || 900;
    const interval = options.interval || 1000;
    const count = options.count || 1;
    const output = options.output || `output_${Date.now()}`;
    const delay = options.delay || 0;

    return new Promise((resolve, reject) => {
        // Start the Chrome Debugging Protocol
        chromeRemoteInterface(async function (client) {
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
            if (options.userAgent) {
                await Network.setUserAgentOverride({
                    userAgent: options.userAgent
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
                if (options.full) {
                    const documentNodeId = await DOM.getDocument().root.nodeId;
                    const bodyNodeId = await DOM.querySelector({
                        selector: 'body',
                        nodeId: documentNodeId
                    }).nodeId;
                    const height = await DOM.getBoxModel({
                        nodeId: bodyNodeId
                    }).model.height;


                    await Emulation.setVisibleSize({
                        width: viewportWidth,
                        height: height
                    });

                    // This forceViewport call ensures that content outside the viewport is
                    // rendered, otherwise it shows up as grey. Possibly a bug?
                    await Emulation.forceViewport({
                        x: 0,
                        y: 0,
                        scale: 1
                    });

                }

                setTimeout(async function () {
                    // js执行结果, 有js不执行问题可以打印出来看
                    const runjs = await Runtime.evaluate({
                        expression: options.beforeScript
                    });
                    if (runjs.result.type !== 'undefined') {
                        console.error(runjs.result.description);
                    }

                    // 处理串行截N张图
                    let current = 0;

                    let render = async () => {
                        const screenshot = await Page.captureScreenshot({
                            format
                        });
                        const buffer = new Buffer(screenshot.data, 'base64');
                        const imgName = count > 1 ? `${output}_${current}.png` : `${output}.png`;
                        file.writeFile(imgName, buffer, 'base64', function (err) {
                            current += 1;
                            if (err) {
                                client.close();
                                reject(err);
                            }
                            else {
                                if (current >= count) {
                                    client.close();
                                    resolve();
                                }
                                else {
                                    setTimeout(render, interval);
                                }
                            }
                        });
                    };

                    render();
                }, delay);
            });
        }).on('error', err => {
            reject(err);
        });
    });
};
