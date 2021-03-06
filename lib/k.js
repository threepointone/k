(function() {
    "use strict";

    var _ = require('underscore'),
        glob = require('glob-whatev'),
        fs = require('fs'),
        path = require('path'),
        D = require('./defer');

    _.mixin(require('./helpers'));

    // super k

    function k(config) {

        if(config instanceof k) return obj; // should we return a clone instead?
        if(!(this instanceof k)) return new k(config);

        this.config = _.extend({}, {
            src: './',
            dest: './dist'
        }, config || {});

        if (this.config.src === this.config.dest) {
            throw new Error('src and dest cannot be the same');
        }

        return this._files();
    }

    _.extend(k.prototype, {
        // populate `this.files`
        _files: function() {
            var t = this;
            this.files = this.config.files = this.config.files || _.map(_(glob.glob(path.join(this.config.src, '**/*'))).filter(function(f) {
                // strip out directories, etc. we just want the files.
                return fs.statSync(f).isFile();
            }), function(f) {
                return {
                    src: f,
                    // should this be relative to .src? maybe not. it doesn't really change.
                    dest: path.relative(t.config.src, f) // set a default destination for the file, relative to config.dest
                };
            });
            return this;
        },
        reset: function() {
            this._files();
        },
        chain: function() {
            return new D({
                host: this.clone()
            });
        },
        // naive clone function
        clone: function() {
            var conf = _.jsonclone(this.config);
            conf.files = _.jsonclone(this.files);
            return k(conf);
        }
    });


    // maintain  a private global registry of tasks
    // not sure this is necessary anymore, but we'll see
    var tasks = {};

    _.extend(k, {
        // register a task
        task: function(name, fn) {
            if(typeof name !== 'string') {
                //sending in a hash
                _.each(name, function(f, n) {
                    k.task(n, f);
                });
                return this;
            }
            if(!_.isFunction(fn)) {
                throw new Error('no function passed');
            }

            tasks[name] = fn;

            if(k.prototype[name]) {
                // task defintion already exists, going to override
                console.log('!!!warning: overwriting task:', name);
            }
            // augment the function to send a callback as last arg, bound to this
            k.prototype[name] = function() {
                var t = this;
                var args = _.toArray(arguments);
                // now naively making sure the last param passed is a function, bound to `this`.
                // todo - must rewrite. not sure how. we'll see. bababooey.
                if(_.isFunction(_.last(args))) {
                    args[args.length - 1] = _.bind(args[args.length - 1], t);
                } else {
                    args.push(_.identity);
                }
                fn.apply(t, args);
                return t;
            };
            // add the task to the deferred chain too
            D.deferMethod(name);

            return this;
        }
    });

    // register the default tasks
    k.task(require('./tasks'));

    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = k;
        }
        exports.k = k;
    } else {
        this['k'] = k;
    }

    k.VERSION = '0.1';

}).call(this);
