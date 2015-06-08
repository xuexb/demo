function sort(arr) {
    var result = [],
        max = Math.max.apply(Math, arr),
        temp, new_arr;

    //生成一个桶
    for (temp = 0; temp < max + 1; temp++) {
        result[temp] = 0;
    }

    for (temp = arr.length - 1; temp >= 0; temp--) {
        result[arr[temp]] += 1;
    }

    new_arr = [];
    for (temp = 0; temp < max + 1; temp++) {
        if (result[temp] !== 0) {
            // console.log(new Array(result[temp]).join(temp + ',').split(','));
            // new_arr.push.apply(new_arr, new Array(result[temp]).join(temp + ',').split(','));
            new_arr.push.apply(new_arr, create(result[temp], temp));
            // new_arr.push(temp);
            // console.log(temp, result[temp] + '次');
        }
    }


    function create(length, num) {
        return (new Array(length).join(num + ',') + num).split(',');
    }

    return new_arr;
}


var len = 10;

var arr = new Array(len).join('1,').split(',').map(function() {
    return Math.round(Math.random() * (len - 1) + 1);
});


function arrfn() {
    // sort(arr);
    console.log(sort(arr));
}

function sortfn() {
    console.log(arr.sort(function(a, b) {
        return a > b;
    }));
}

console.time('arrfn');
arrfn();
console.timeEnd('arrfn');

console.time('sortfn');
sortfn();
console.timeEnd('sortfn');