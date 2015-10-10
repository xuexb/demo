# html文件中lang的研究

> 这里是指`*.html`文件中`<html>`中的`lang`属性的值对`chrome`浏览器中提示翻译的功能研究

经研究发现：

## 当无lang定义时

只要有点英文就会提示翻译，[英文多的demo](no.html)、[英文很少的demo](no2.html)

## 当lang=en时

* 当英文数量大于中文时提示翻译，[英文大于中文](en.html)
* 当中文大于英文时不提示翻译，[中文大于英文](en2.html)


## 当lang=cn时

即使英文再多也不提示翻译，[demo](cn.html)

## 当lang=zh-cn时

即使英文再多也不提示翻译，[demo](zh-cn.html)