"use strict";

var k = require('./k'),
    tasks = require('./tasks'),
    async = require('async'),
    _ = require('underscore'),
    fs = require('fs');

var x = k({
    base: './',
    dest: 'build'
}).task(tasks).init(function() {
    this.read(function() {
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
});

// then, you can use deferreds and do this - 
// x().task(tasks).$
//	.init()
//	.read()
//	.filter(/.js/)
//	.compress({})
//	.write();