"use strict";

var k = require('./k'),
    tasks = require('./tasks'),
    async = require('async'),
    _ = require('underscore'),
    fs = require('fs');

k.task(tasks);

var x = k({
    base: './',
    dest: 'build'
});

x.read(function() {
    var y = this.clone();

    this.filter(/t/, function() {
        this.compress({}, function() {
            this.hashify(function() {
                this.write(function() {
                    console.log('x', _.pluck(x.files, 'src'));
                    console.log('y', _.pluck(y.files, 'src'));                    
                });
            });
        });
    });
});


// then, you can use deferreds and do this - 
// x().read().filter(/.js/).compress({}).write();