(function() {
    "use strict";

    var _ = require('underscore'),
        async = require('async'),
        path = require('path'),
        fs = require('fs'),
        wrench = require('wrench');

    _.mixin(require('./helpers'));

    // inserts a string into a file name, bounded by dots 
    // e.g - 
    // `fileSuffix('/home/a.txt', 'b') === '/home/a.b.txt'`
    function fileSuffix(fname, suff) {
        return path.join(path.dirname(fname), path.basename(fname, path.extname(fname)) + suff + path.extname(fname));
    }

    var tasks = {
        // read in `f.content` for all `f` in `this.files`
        read: function(done) {
            var t = this;
            _.each(this.files, function(f) {
                f.content = fs.readFileSync(f.src, 'utf8');
            });
            done();
        },
        // filter out `this.files`, based on regex, or function
        filter: function(regex, done) {
            this.files = _.filter(this.files, function(f) {
                return _.isFunction(regex) ? regex(f) : regex.test(f.src);
            });
            done();
        },
        // compress css and js `f.content`s, generate `.min` filenames for dest
        compress: function(options, done) {
            if(_.isFunction(options)) {
                done = options;
            }

            this.files = _.map(this.files, function(f) {
                return {
                    src: f.src,
                    content: path.extname(f.src) === '.js' ? _.compressjs(f.content) : (path.extname(f.src) === '.css' ? _.compresscss(f.content) : f.content),
                    dest: fileSuffix(f.dest, '.min')
                };
            });
            done();
        },
        // for all `f` in `this.files`, write `f.content` to `f.dest`
        write: function(files, done) {
            if(_.isFunction(files)) {
                done = files;
                files = this.files;
            }
            var t = this;
            _.each(files, function(f) {
                var dest = path.join(t.config.dest, f.dest);
                wrench.mkdirSyncRecursive(path.dirname(dest));
                fs.writeFileSync(dest, f.content);
            });
            done();
        },
        // takes a bunch of files, creates a meta hash with it, and writes it to `<target>.json`
        meta: function(files, target, done) {
            var meta = {},
                t = this;
            // YURRRGHHHH
            if(_.isFunction(target)) {
                done = target;
                target = files;
                files = this.files;
            } else if(_.isFunction(files)) {
                done = files;
                target = 'meta';
                files = this.files;
            }
            _.each(files, function(f) {
                meta[path.relative(t.config.src, f.src)] = f.dest;
            });
            t.write([{
                content: JSON.stringify(meta, null, '    '),
                dest: target + '.json'
            }], done);
        },
        // takes a bunch of files, generates hashed file names, writes to them
        hashify: function(done) {
            this.files = _.map(this.files, function(f) {
                return {
                    src: f.src,
                    content: f.content,
                    dest: fileSuffix(f.dest, '.' + _.hashify(f.content))
                };
            });
            done();
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
                content: _(this.files).pluck('content').join('\n'),
                dest: dest
            }], done);
        },

        templates: function(options, done) {
            var dest = 'templates.js'; // this has to be rewritten.
            // basic logic is so -
            // find the longest common starting substring in all files
            // excluding that bit, construct template name by stripping / and ., and replacing with - (or _)
            // write it to that common dir, unless passed in options
            // for now, just read all ejs templates
            // remember to add the new compiled templates into the .files arr?
            done();
        },

        analyze: function(options, done) {
            done();
        },
        yuianalyze: function(target, done) {
            if(_.isFunction(target)) {
                done = target;
                target = 'manifest.js';
            }
            _.map(this.files, function(f) {
                var analysis = _.yuianalyze(f.content);
                console.log(f.src, f.dest, analysis);
            });
            done();
        },

        cdnify: function(options, done) {
            // config options -
            // cdnbase
            done();
        },

        watch: function(onChange, done) {
            // setup handler on `this.files` that run everytime a file in the list changes
            done();
        },

        cmd: function(cmd, done) {
            // todo - pipe to std out/stderr
            require('child_process').exec(cmd, done);
        },

        clean: function(done) {
            // wipe out dest? what about versioned?
            if(this.config.src !== this.config.dest) {
                this.cmd('rm -rf ' + this.config.dest, done);
            } else {
                throw new Error('src is same as dest, aborting clean')
            }
        },
        // run jslint (csslint?)
        lint: function(done) {

        },
        // do nothing, and pass along execution
        noop: function() {
            var args = _.toArray(arguments);
            var done = _.isFunction(args[args.length - 1]) ? args[args.length - 1] : _.identity;
            // no op
            done();
        }
    };

    module.exports = tasks;


}).call(this);
