var assert = require('assert'),
	k = require('./k'),
	__should = require('should');



describe('k', function(){
	describe('initialize', function(){
		it('shouldn\'t throw errors', function(){
			var x = k();
		});
		it('should accept a config object', function(){
			var x = k({
				src:'src',
				dest: 'dest'
			});
			x.config.src.should.equal('src');
		});

	});
});