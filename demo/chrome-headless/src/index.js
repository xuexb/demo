/**
 * @file 批量读取xml并截图
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const checkOptions = require('./checkOptions');
const getXmlData = require('./getXmlData');
const saveImage = require('./saveImage');
const moveImage = require('./moveImage');
const execSync = require('child_process').execSync;
const path = require('path');

const options = {
    xmlPath: '3d.xml',

    // 渲染相关的代码, 会以 xml 内每个 item 去执行, 也就是说会根据每个模型去渲染, 可以配置不同的输出文件名之类的
    renderOptions: {
        // 延迟多少 ms 去截图
        delay: 5000,

        // 屏宽高
        viewportWidth: 414 * 2,
        viewportHeight: 221 * 2,

        // 输出文件名, 不用带后缀扩展名
        // 如果不值, 将按时间缀保存
        // 如果值个固定的, 将一直覆盖
        // 可以是 function , 按 uri 去保存, 6不6?
        output(item) {
            const outputPath = path.resolve(__dirname, `../output/0906/${item.uri}`);

            // 创建目录
            execSync(`mkdir -p ${outputPath}`);

            return `${outputPath}/${item.uri}`;
        },

        // 链接
        url(item) {
            return '//github.xuexb.com?r=' + item.key;
        },

        // 一共截多少张
        count: 1,

        // 截每张图的间隔毫秒, 如果 count 为1则忽略
        interval: 30,

        // 截图前置js, 主要去背景色和旋转模型
        // item -> options.data[index]
        // data -> options.renderOptions
        // index -> 当前索引
        beforeScript(item, data, index) {
            // 需要执行的js
            const js = [
            ];

            // 把链接和js操作角度打出来
            console.log(JSON.stringify({
                key: item.key,
                url: data.url,
                uri: item.uri,
                // runjs: js[3],
                // output: data.output
            }, null, 4));

            return js.join('; ');
        }
    }
};

// 检查配置
checkOptions(options)

// 请求数据
.then(getXmlData)

// 移动图片
// .then(moveImage)

// 保存图片
.then(saveImage)

// 完成
.then(options => {
    console.log('render ok');
})
.catch(err => {
    console.error(err);
});
