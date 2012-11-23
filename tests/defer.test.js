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
			},
			d: function(){

			}
		};
		D.deferMethod('a');
		D.deferMethod('c');

		D.importMethod('d');

		this.x.D = new D({
			host: this.x
		});
	});
	
	describe('import', function() {
	
		it('should import a regular method, that can still be chained', function(done) {
			this.x.D.a().d().then(done);
		});
	
		it('should be able to import, chain, and execute in order', function(done) {
			this.x.D.a().c().then(done);
		});
	});
});