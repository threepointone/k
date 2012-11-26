"use strict";

var path = require('path'),
    _ = require('underscore');

module.exports = {
    jsonclone: function(o) {
        return JSON.parse(JSON.stringify(o));
    },
    hashify: function(str) {
        return require('crypto').createHash('sha1').update(str).digest('hex');
    },
    compressjs: function(script) {
        var uglify = require('uglify-js');
        var jsp = uglify.parser,
            pro = uglify.uglify;

        return pro.gen_code(pro.ast_mangle(pro.ast_squeeze(jsp.parse(script || ''))));
    },
    compresscss: function(css) {
        return(require('./cssmin.js').cssmin(css));
    },

    yuianalyze: function(script) {
        var ret = {};
        require('burrito')(script, function(node) {
            var value = _.flatten(node.node.slice(1));
            if(node.name === 'object' && value[0] === 'requires') {
                var parent = node.parent();
                if(parent && parent.node[1]) {
                    var n = parent.node[1];
                    if(n[0] === 'dot' && n[2] === 'add') {
                        // success! get meta data now
                        var requires = eval(node.source());
                        var name = _.flatten(parent.node[2])[1];

                        ret[name] = {
                            requires: requires,
                            type: 'js'
                        };
                    }
                }
            }
        });
        return ret;
    }
};
