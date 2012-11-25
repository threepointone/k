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

x.read(function() {
    y = x.clone();
    x.D.filter(/.js$/).compress({}).hashify().write().then(function() {
        console.log('x', _.pluck(x.files, 'src'));
        console.log('y', _.pluck(y.files, 'src'));
        console.log(x === y);
    });
});

x.D.wait(1500).log('waited').wait(2000).read().write().then(function() {
    console.log('done');
});


//compound tasks
k.task('a', function(done){ done(); });

k.task('b', function(done){ done(); });

k.task('c', function(done){
    this.D.a().b().then(done);
});

k().D.c().then(function(){
    console.log('done!');
});

k().D.cmd('mkdir x').then(function(err, list){
    console.log(err, list);
});














