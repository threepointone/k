"use strict";
var _ = require('underscore'),
    k = _(process.argv).indexOf('html-cov') >= 0 ? require('../lib-cov/k') : require('../lib/k'),
    async = require('async'),
    __should = require('should'),
    glob = require('glob-whatev');


describe('D', function(){
	it('should be able to chain, and execute in order', function(done){
		var x = k();
		x.D.wait(200).wait(200).wait(200).then(done);
	});
});

// make a new deferred
// import a method 
// import an async method  