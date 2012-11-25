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
    x.chain().filter(/.js$/).compress({}).hashify().then(function() {
        console.log('x', _.pluck(x.files, 'src'));
        console.log('y', _.pluck(y.files, 'src'));
        console.log(x === y);
    });
});

x.chain().wait(1500).log('waited').wait(2000).read().then(function() {
    console.log('done');
});


//compound tasks
k.task('a', function(done){ done(); });

k.task('b', function(done){ done(); });

k.task('c', function(done){
    this.chain().a().b().then(done);
});

k().chain().c().then(function(){
    console.log('done!');
});

k().chain().cmd('ls -al').then(function(err, list){
    console.log(list);
});














