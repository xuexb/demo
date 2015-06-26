var jia = function(){
    var args = [].slice.call(arguments).map(function(val){
        return parseInt(val * 100, 10) || 0;
    });

    if(!args.length){
        return 0;
    }

    return new Function('return ('+ args.join('+') +') / 100')();
}

console.log(jia('1',2))
console.log(jia(.01,2))
console.log(jia(.1,.2))
