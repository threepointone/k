"use strict";

var _ = require('underscore'),
    async = require('async'),
    path = require('path'),
    fs = require('fs');

_.mixin(require('./helpers'));

module.exports = {

    read: function(done) {
        var t = this;
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
        var meta = {},
            t = this;

        if(_.isFunction(options)) {
            done = options;
        }

        this.write(_.map(this.files, function(f) {
            var dest = path.join(path.dirname(f.dest), path.basename(f.dest, path.extname(f.dest)) + '.min' + path.extname(f.dest));
            meta[path.relative(t.config.src, f)] = dest;
            return {
                src: f.src,
                content: _.compressjs(f.content),
                dest: dest
            };
        }), function() {
            t.write([{
                src: f.src,
                content: JSON.stringify(meta),
                dest: path.join(t.config.dest, 'compressed.json')
            }], done);
        });

    },
    write: function(files, done) {
        if(_.isFunction(files)) {
            done = files;
            files = this.files;
        }
        _.each(files, function(f) {
            console.log('fake writing to ' + f.dest);
        });
        done();
    },
    hashify: function(done) {
        var meta = {},
            t = this;

        this.write(_.map(this.files, function(f) {
            var dest = path.join(path.dirname(f.dest), path.basename(f.dest, path.extname(f.dest)) + '.' + _.hashify(f.content) + path.extname(f.dest));
            meta[path.relative(t.config.src, f)] = dest;
            return {
                src: f.src,
                content: f.content,
                dest: dest
            };
        }), function() {
            t.write([{
                content: JSON.stringify(meta),
                dest: path.join(t.config.dest, 'hashed.json')
            }], done);
        });

    },
    wait: function(time, done) {
        setTimeout(done, time);
    },
    log: function(msg, done) {
        console.log(msg);
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
    },
    clean: function(callback) {

    }
};
