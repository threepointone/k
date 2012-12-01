module.exports = function(config) {
    var k = require('k');


    var myc = k(config).chain().clean().read().templates();

    // run the next 2 in parallel
    // first the images
    var images = myc.chain().filter(/[\.img|\.jpg|\.gif|\.png]$/).write().meta('assets');

    // then the css/js
    var code = myc.chain().filter(/[\/js\/\.js|\/css\/\.css]$/).yuianalyze();

    if(config.compress) {
        code = code.compress().yuianalyze('.min');
    }
    if(config.hashify) {
        code = code.hashify().yuianalyze('.hash');
    }

};
