"use strict";
var _ = require('underscore'),
	D = _(process.argv).indexOf('html-cov') >= 0 ? require('../lib-cov/defer') : require('../lib/defer'),
	async = require('async'),
	__should = require('should');

describe('D', function() {
	
	beforeEach(function() {
		this.x = {
			a: function(cb) {
				this.b(cb);
			},
			b: function(cb) {
				cb();
			},
			c: function(cb) {
				cb();
			}
		};
		D.deferMethod('a');
		D.deferMethod('c');

		this.x.D = new D({
			host: this.x
		});
	});
	
	describe('import', function() {
		it('should import a method as a deferred version');
	
		it('should import a regular method, that can still be chained');
	
		it('should be able to chain, and execute in order', function(done) {
			this.x.D.a().c().then(done);
		});
	});
});