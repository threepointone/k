"use strict";

var k = require('./index'),
    async = require('async'),
    _ = require('underscore'),
    fs = require('fs');

var x = k({
    base: './',
    dest: 'build'
}).chain();

x.read()
	.compress()
	.hashify()
	.write()
	.meta()
	.clean()
	.log('done');
