# 多级 JSON 转一级 JSON

```js
/**
 * 解析多级 JSON 为一级 JSON
 *
 * @param  {Object} data JSON 数据
 *
 * @return {Object}
 */
const parse = data => {
    const uid = `uid_${Date.now()}`;
    const process = (input, prefix = '', json = {}) => {
        Object.keys(input).forEach(key => {
            const val = input[key];

            if (!json.hasOwnProperty(`${prefix}${key}.`)) {
                json[`${prefix}${key}.`] = uid;
            }

            if ('object' === typeof val && !Array.isArray(val) && !!val) {
                process(val, `${prefix}${key}.`, json);
            }
            else {
                json[`${prefix}${key}.`] = val;
            }
        });

        return json;
    };

    const json = process(data);
    const result = {};
    Object.keys(json).forEach(key => {
        if (json[key] !== uid) {
            result[key.slice(0, -1)] = json[key];
        }
    });
    return result;
};


var data = {
    a: {
        a1: 1,
        a5: 5,
        a8: {
            a11: 1,
            a22: null,
            a33: {
                a555: 1,
                a666: 'string',
                null: null,
                undefined: undefined,
                array: [],
                number: 12
            }
        }
    },
    b: {},
    c: 123,
    妹子: '真妹子'
};
const json = parse(data);
console.log(JSON.stringify(json, null, 4));
```