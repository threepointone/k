"use strict";

var _ = require('underscore'),
    fs = require('fs');

_.mixin(require('./helpers'));

module.exports = {

    read: function(done) {
        _.each(this.files, function(f) {
            f.content = fs.readFileSync(f.src, 'utf8');
        });
        done();
    },
    filter: function(regex, done) {
        this.files = _.filter(this.files, function(f) {
            return _.isFunction(regex) ? regex(f) : regex.test(f.src);
        });
        done();
    },
    compress: function(options, done) {
        _.each(this.files, function(f) {
            f.content = _.compressjs(f.content);
            f.dest = f.src + '.min'; // todo
        });
        done();
    },
    write: function(done) {
        _.each(this.files, function(f) {
            console.log('fake writing to ' + f.dest);
        });
        done();
    },
    hashify: function(done) {
        _.each(this.files, function(f) {
            f.dest = f.src + '.' + _.hashify(f.content); // todo
        });
        done();

    },
    concat: function(options, done) {

    },
    templates: function(options, callback) {

    },
    analyze: function(options, callback) {

    },
    cdnify: function(options, callback) {

    },
    watch: function() {

    },
    cmd: function(cmd, callback) {
        require('child_process').exec(cmd, callback);
    }
};