"use strict";

var k = require('./index'),
    async = require('async'),
    _ = require('underscore'),
    fs = require('fs');

var x = k({
    src: './lib',
    dest: 'build'
}).chain();

x
.clean()
.filter(/.js$/)
.read()
.compress()
.hashify()
.concat('built.js')
.log('done');
