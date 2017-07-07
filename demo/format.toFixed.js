/**
 * 格式化数字单位
 *
 * @param  {number} size        数值
 * @param  {number} [pointLength=2] 补全位数
 * @param  {Array} [units=['B', 'K', 'M', 'G', 'TB']]        格式数据
 * @param  {number} [base=1024]        基数
 *
 * @return {string}
 */
var format = function (size, pointLength, units, base) {
    var unit;

    units = units || ['B', 'K', 'M', 'G', 'TB'];

    base = base || 1024;

    while ((unit = units.shift()) && size > base) {
        size = size / base;
    }

    return (unit === units[0] ? size : size.toFixed(pointLength || 2)).replace(/\.?0+$/, '') + unit;
};
