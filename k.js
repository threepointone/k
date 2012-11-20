var _ = require('underscore'),
    fs = require('fs'),
    glob = require('glob-whatev'),
    path = require('path');

(function(ctx) {
    var root = this;

    var tasks = {};

    function k(config) {

        function init(callback) {
            this.config = config = _.extend({}, {
                base: './',
                dest: './'
            }, config);

            _.each(tasks, function(fn, name) {
                task(name, fn);
            });

            var files = [];
            var src = [path.join(config.base, '*')]; // todo - nested dirs
            _.each(src, function(pattern) {
                glob.glob(pattern).forEach(function(path) {
                    files.push({
                        src: path
                    });
                });
            });
            this.files = files; // todo - are we sure?
            callback && _.bind(callback, this)(null, files);
        }

        function task(name, fn) {
            var t = this;
            if(typeof name !== 'string') {

                //sending in a hash
                _.each(name, function(f, n) {
                    task.apply(t, [n, f])
                });
                return this;
            }

            tasks[name] = t[name] = function() {
                var args = _.toArray(arguments);
                if(_.isFunction(_.last(args))) {
                    args[args.length - 1] = _.bind(args[args.length - 1], t);
                } else {
                    args[args.length] = _.bind(function() {}, t);
                }
                fn.apply(t, args);
                return t;

            };
            return this;
        }

        return {
            init: init,
            task: task
        };
    }

    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = k;
        }
        exports.k = k;
    } else {
        root.k = k;
    }

    k.VERSION = '0.1';

}).call(this);