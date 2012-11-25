"use strict";

var _ = require('underscore'),
    async = require('async'),
    path = require('path'),
    fs = require('fs');

_.mixin(require('./helpers'));

function fileSuffix(fname, suff){
    return path.join(path.dirname(fname), path.basename(fname, path.extname(fname)) + suff + path.extname(fname));
}

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

        if(_.isFunction(options)) {
            done = options;
        }

        var files = _.map(this.files, function(f) {
            var dest = fileSuffix(f.dest, '.min');
            var content = path.extname(f.src)==='.js' ? _.compressjs(f.content):
                            (path.extname(f.src)==='.css' ? _.compresscss(f.content):
                                f.content);
            return {
                src: f.src,
                content: content,
                dest: dest
            };
        });
        this.write(files, done);

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
    meta: function(files, target, done){
        var meta = {}, t = this;
        _.each(files, function(f){
            meta[path.relative(t.config.src, f)] = f.dest;
        });
        t.write([{
            content: JSON.stringify(meta),
            dest:  (target || 'meta') +'.json'
        }], done);
    },
    hashify: function(done) {

        var files = _.map(this.files, function(f) {
            var dest = fileSuffix(f.dest, '.' +  _.hashify(f.content));
            return {
                src: f.src,
                content: f.content,
                dest: dest
            };
        });
        this.write(files, done);

    },
    wait: function(time, done) {
        setTimeout(done, time);
    },
    log: function(msg, done) {
        console.log(msg);
        done();
    },
    concat: function(dest, done) {
        this.write([{
            content: _(this.files).pluck('content').join('/n'),
            dest: dest
        }], done);
    },
    templates: function(options, callback) {
        // for now, just read all ejs templates
    },
    analyze: function(options, callback) {
        // just a yui analyze for now, I guess
    },
    cdnify: function(options, callback) {
        // config options -
        // cdnbase
        done();
    },
    watch: function(onChange, done) {
        // setup handler on `this.files` that run everytime a file in the list changes
        done();
    },
    cmd: function(cmd, callback) {
        require('child_process').exec(cmd, callback);
    },
    clean: function(callback) {
        // wipe out dest? what about versioned?
    }
};
