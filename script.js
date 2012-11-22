"use strict";

var k = require('./index'),
    async = require('async'),
    _ = require('underscore'),
    fs = require('fs');

var x = k({
    base: './',
    dest: 'build'
});
var y;

x.read(function(){
    y = x.clone();
    x.D.filter(/.js$/).compress({}).hashify().write().then(function(){
                    console.log('x', _.pluck(x.files, 'src'));
                    console.log('y', _.pluck(y.files, 'src'));
                    console.log(x === y);        
    });
});

// x.read(function() {
//     var y = this.clone();

//     this.filter(/.js$/, function() {
//         this.compress({}, function() {
//             this.hashify(function() {
//                 this.write(function() {
//                     // console.log('x', _.pluck(x.files, 'src'));
//                     // console.log('y', _.pluck(y.files, 'src')); 
//                     // console.log(x === y);
//                 });
//             });
//         });
//     });
// });


x.D.wait(1500).wait(2000).read().write().then(function(){
    console.log('done');
});


