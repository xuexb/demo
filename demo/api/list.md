# 获取照片列表
根据`page`,`page_size`来获取可分页的照片列表数据

## URL
http://github.xuexb.com/api/photos/list

## 支持格式
JSON

## HTTP请求方式
GET

## 是否需要登录
是

## 请求参数
参数名 | 必选 | 类型及范围 | 说明
--- | --- | --- | ---
page | true | int | 当前页
page_size | false | int | 每页多少条数据, 默认为20


##  正确返回结果示例
    
```
{
    "items": [
        {
            "id": 1,//专辑id
            "name": "这是一个demo",//照片名称
            "src": "http://www.xx.com/src/a.jpg"//绝对路径，带http://
        }
    ]
}
```

## 无数据示例

```
{
    "items": []
}
```

##  错误返回结果示例

```
{
    "errcode": 1002,//没登录状态码
    "errmsg":"登录超时",//可选
    "url": "/login" //登录页url
}
```