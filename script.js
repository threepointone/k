"use strict";

var k = require('./index'),
    async = require('async'),
    _ = require('underscore'),
    fs = require('fs');

var x = k({
    base: './',
    dest: 'build'
});

x.read(function() {
    var y = this.clone();

    this.filter(/.js$/, function() {
        this.compress({}, function() {
            this.hashify(function() {
                this.write(function() {
                    console.log('x', _.pluck(x.files, 'src'));
                    console.log('y', _.pluck(y.files, 'src')); 
                    console.log(x === y);
                });
            });
        });
    });
});


// then, you can use deferreds and do this - 
// k().read().filter(/.js/).compress({}).write();
