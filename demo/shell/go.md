# shell快捷登录go脚本

使用以下脚本可以实现:

1. 在osx下记录session
2. 方便快捷登录, `go 简称`
3. 查看列表, `go -l`

### 配置`~/.ssh/config`

```
Host *
ControlPath ~/.ssh/master-%r@%h:%p
ControlMaster auto
ControlPersist 50h
```

### 添加go脚本

保存以下内容到你的`PATH`可执行目录, 如我的`~/bin/go`中, 修改`server_list`, 格式是`简称     目标服务器`:

```shell
#! /bin/sh
#
# 快捷go v1.0.1

# 感谢美丽说的@alien  www.baidufe.com

# 定义机器的快捷方式
server_list=(
#----------------------------------------------------------------------------------------------------
#   "快捷方式        机器名/IP "
#----------------------------------------------------------------------------------------------------
    "aliyun       xieyaowu@xuexb.com"
    "aliyun2       xieyaowu2@xuexb.com"
)

# 使用帮助
help(){
    echo "
    远程登录工具：
    使用方法：
        【1】：go 机器名简称

        【2】：查看所有机器快捷方式：
            go -l
        \n"
    exit 1
}

# 查看所有快捷方式
show_list() {
    echo "
您可以使用快捷方式进行登录如下服务器，如：go aliyun
"
    echo "+------------------------------------------------------------------------------+"
    
    # 格式化输出
    printf "%-1s %-22s %-1s %-57s %-1s\n" \
            \| 名称 \| 目标机器 \|
    
    echo "+------------------------------------------------------------------------------+"

    for (( i=0;i<${#server_list[*]};i=i+1 ));do
        A=`echo ${server_list[$i]} | awk '{print $1}'`
        B=`echo ${server_list[$i]} | awk '{print $2}'`
        # 格式化输出
        printf "%-1s %-20s %-1s %-53s %-1s\n" \
                \| $A \| $B \|
    done
    echo "+------------------------------------------------------------------------------+

快捷go v1.0.1
    "
}

# 远程登录
remote_login(){

    # 默认的目标机器是$1
    host=$1

    # 从server_list里查询是否有预定的快捷方式
    for key in ${!server_list[*]} ; do
        A=`echo ${server_list[$key]} | awk '{print $1}'`    # 快捷方式
        B=`echo ${server_list[$key]} | awk '{print $2}'`    # 机器名/IP
        if [ "$host" == "$A" ];then
            host=$B;
            break;
        fi
    done

    # 登录目标机器
    ssh $host
}


clear
# 未指定参数，或者参数为 -h | --help，则出现使用帮助
if [[ "$1" == "" || "$1" == "-h" || "$1" == "--help" ]];then
    help;

# 查看所有快捷方式
elif [[ "$1" == "--list" || "$1" == "-l" ]];then
    show_list;

# 编辑
elif [[ "$1" == "--edit" || "$1" == "-e" ]];then
    vim $0;

# 执行登录
else
    remote_login $1 $2;

fi
```