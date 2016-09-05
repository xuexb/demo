#!/bin/sh

arr="12 3 4 5"

for i in $arr  #当数组用，所以不能加双引号
do

    echo $i

done

for i in "$arr"  #加了双引号，就会将$arr的内容作为一个字符串一起输出
do

    echo $i

done