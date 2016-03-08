var base = function () {
    console.log('调用了base');
};

base.prototype.data = function (){
    console.log('base.data');
    console.log(this.name);
};

base.prototype.log = function () {
    console.log('base.log');
    console.log(this.name);
};


var F = function () {};
F.prototype = base.prototype;
var show = function () {
    console.log('show');
    base.call(this);
};
show.prototype = new F();


var app = new show();
app.name = 1;
app.data()

new base().data();