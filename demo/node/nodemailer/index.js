var nodemailer = require('nodemailer');
// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport({
    host: 'smtp.qq.com', // 主机
    secure: true, // 使用 SSL
    port: 465, // SMTP 端口
    auth: {
        user: '463004799@qq.com', // 账号
        pass: '463004799' // 密码
    }
});
// 设置邮件内容
var mailOptions = {
    from: 'test <463004799@qq.com>', // 发件地址
    to: 'xieyaowu@baidu.com,fe.xiaowu@gmail.com', // 收件列表
    subject: '接不接', // 标题
    html: '<b>thanks a for visiting!</b> 世界，你好！' // html 内容
};
// 发送邮件
smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Message sent: ', response);
    }
    smtpTransport.close(); // 如果没用，关闭连接池
});
