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
}).read(function() {
        this.filter(/.js/, function() {
            this.compress({}, function() {
                this.hashify(function() {
                    this.write(function() {
                        console.log(this);
                    });
                });

            });
        });
    });


// then, you can use deferreds and do this - 
// x().read().filter(/.js/).compress({}).write();