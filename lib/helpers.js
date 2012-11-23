"use strict";

var path = require('path');

module.exports = {
    jsonclone: function(o){
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
    }
};