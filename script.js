var k = require('./index');

k({ src: 'lib', dest: 'build' })
.chain()
.clean()
.filter(/.js$/)
.read()
.compress()
.hashify()
.concat('built.js')
.log('done');
