var k = require('./index');

k({ src: 'lib' })
.chain()
.clean()
.filter(/\.js$/)
.read()
.compress().write().meta('compressed')
.log('somewhere in the middle')
.hashify().write().meta('hashed')
.concat('built.js')
.fn(function(done){
	console.log('exec arbit code');
	done();
})
.log('just about finishing...')
.clean()
.then(function(){
	console.log('done')
}, function(e){
	console.log('failed', e.stack);

});


k({src:'examples/yui', dest: 'examples/dist'}).chain()
.clean()
.filter(/\.js$/)
.read()
.yuianalyze()
.log('analyzed');
