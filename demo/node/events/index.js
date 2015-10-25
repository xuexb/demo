'use strict';

var events = require('events');
var EventEmitter = new events();

EventEmitter.on('test', function (data) {
    console.log(data);
});

EventEmitter.once('test', function (data, data2, data3) {
    console.log(data, data2, data3);
});

EventEmitter.emit('test', 1, 2, 3);
EventEmitter.emit('test', 1, 2, 3);

setTimeout(function(){
    EventEmitter.emit('test', {});
}, 1000);