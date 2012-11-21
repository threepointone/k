var _ = require('underscore'),
    fs = require('fs'),
    glob = require('glob-whatev'),
    path = require('path');


(function(ctx) {
    var root = this;
    var instances = [];

    var tasks = {};

    function k(config) {

        function init(callback) {
            var t = this;
            instances.push(t);
            this.config = config = _.extend({}, {
                base: './',
                dest: './'
            }, config || {});

            _.each(tasks, function(fn, name) {
                task.apply(t, [name, fn])
            });



            var files = this.config.files || [];
            if(!this.config.files) {
                glob.glob(path.join(config.base, '**')).forEach(function(path) {
                    files.push({
                        src: path
                    });
                });

                this.files = files; // todo - are we sure?
            }
            else{
                this.files = this.config.files;
            }

            // callback && _.bind(callback, this)(null, files);
            return this;

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

            // tasks[name] = fn;
            t[name] = function() {
                var args = _.toArray(arguments);
                // todo - now naively making sure the last param passed is a function. 
                // must rewrite. not sure how. we'll see. bababooey. 

                if(_.isFunction(_.last(args))) {
                    args[args.length - 1] = _.bind(args[args.length - 1], t);
                } else {
                    args.push(_.identity);
                }
                fn.apply(t, args);
                return t;

            };
            return t;
        }

        function clone(){
            var conf = _.jsonclone(this.config);
            conf.files = _.jsonclone(this.files);
            return k(conf);
        }

        var o = {
            init: init,
            task: task,
            clone: clone
        };

        o.init.apply(o);
        return o;
    }

    k.task = function(name, fn) {
        // todo - handle collisions?
        var t = this;
        if(typeof name !== 'string') {

            //sending in a hash
            _.each(name, function(f, n) {
                k.task(n, f);
            });
            return this;
        }
        tasks[name] = fn;

        // give all instances the new tasks as well
        _.each(instances, function(inst) {
            t.task(name, fn);
        });
    };

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