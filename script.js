"use strict";

var k = require('./index'),
    async = require('async'),
    _ = require('underscore'),
    fs = require('fs');

var x = k({
    src: './lib',
    dest: 'build'
}).chain();

x.read().compress().hashify().meta('meta/compressed').filter(/.js$/).concat('built.js').log('done');
