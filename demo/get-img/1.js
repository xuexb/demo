const Caiji = require('./index');

let data = [];
for(let i = 1000; i <= 1010; i++) {
    data.push({
        url: `http://qzs.qq.com/qzone/client/photo/qzone_shuoshuo_pic/egg_b_${i}.jpg`,
        id: i
    });
}

let app = new Caiji(data, {
    uploadPath: './upload/qzone_shuoshuo_pic_1000/'
});
app.run();
