"use strict";
var _ = require('underscore'),
    k = _(process.argv).indexOf('html-cov') >= 0 ? require('../lib-cov/k') : require('../lib/k'),
    async = require('async'),
    __should = require('should'),
    glob = require('glob-whatev');



// make a new deferred
// import a method 
// import an async method  