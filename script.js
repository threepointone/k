var k = require('./index');

k({ src: 'lib' })
.chain()
.clean()
.filter(/.js$/)
.read()
.compress().write().meta('compressed')
.hashify().write().meta('hashed')
.concat('built.js')
.log('done')
.then(function(){
	console.log('done')
}, function(){
	console.log('failed');
});


k({src:'examples/yui', dest: 'examples/dist'}).chain()
.clean()
.filter(/.js$/)
.read()
.yuianalyze()
.log('analyzed');
