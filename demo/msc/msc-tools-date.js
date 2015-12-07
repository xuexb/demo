(function(msc) {
    /**
     * 日期相关操作
     * @namespace msc.tools.date
     * @memberOf msc.tools
     * @author xieliang
     * @email xieyaowu@meishichina.com
     */
    var date = msc.register("msc.tools.date");


    /**
     * 格式化日期
     * @param  {string} str  目标格式
     * @param  {(null|Date)} date 如果为空则调用当前时间,或时间戳,或日期对象
     * @return {string}      美化后的字符串
     *
     * @function
     * @memberOf msc.tools.date
     *
     */
    date.format = function(str, date) {
        var getTime,
            // weeks,
            key;
        if (!str) {
            return "";
        }
        if (date) {
            if (!(date instanceof Date)) {
                date = new Date(parseInt(date, 10));
            }
        } else {
            date = new Date();
        }

        getTime = {
            "M+": date.getMonth() + 1, //月份           
            "d+": date.getDate(), //日           
            "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时           
            "H+": date.getHours(), //小时           
            "m+": date.getMinutes(), //分           
            "s+": date.getSeconds() //秒      
        }

        // weeks = ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"];

        //如果有年
        if (/(y+)/i.test(str)) {
            //RegExp.$1为上次正则匹配的第1个结果，那么length就不用说了吧
            str = str.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        //如果有星期，思路同年
        // if (/(E+)/.test(str)) {
        //     str = str.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + weeks[date.getDay()]);
        // }
        for (key in getTime) {
            if (new RegExp("(" + key + ")").test(str)) {
                str = str.replace(RegExp.$1, (RegExp.$1.length == 1) ? (getTime[key]) : (("00" + getTime[key]).substr(("" + getTime[key]).length)));
            }
        }
        return str;
    }



    /**
     * 美化时间
     * @param  {number} e 目标时间戳
     * @param {boolean} [mark=false] 是否为简单格式
     * @return {string}   美化成功的字符
     *
     * @memberOf msc.tools.date
     * @function
     *
     * @example
     *     1, msc.tools.date.elapsed("1397535629151") => 1小时前
     *     2, msc.tools.date.elapsed("1397017408705") => 2014-4-9 12:23
     *     3, msc.tools.date.elapsed("1397449844036") => 昨天12:30
     *     4, msc.tools.date.elapsed("1397447010786") => 昨天11:43
     *     5, msc.tools.date.elapsed("1394297361000", true) => 2014-3-9
     */
    date.elapsed = function(e, mark) {
        var past = Math.round((new Date - e) / 1000),
            result;
        if (past < 10) {
            result = '刚刚';
        } else if (past < 60) {
            result = Math.round(past) + "秒前";
        } else if (past < 3600) {
            result = Math.round(past / 60) + "分钟前";
        } else if (past < 86400) {
            result = Math.round(past / 3600) + "小时前";
        } else {
            result = mark ? date.format('yyyy-M-d', e) : date.format('yyyy-M-d H:m', e);
        }
        return result;
    }

}(msc));