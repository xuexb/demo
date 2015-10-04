Array.prototype.splice = function(start, length){
    var len = this.length;
    var i = 0;
    var res = [];
    var newArr = [];

    for(; i<len; i++){
        if(i>=start && i<= start + length){
            res.push(this[i]);
            break;
        }

        newArr.push(this[i]);
    }

    return newArr;
}

console.log(([1,2,3]).splice(1,1));