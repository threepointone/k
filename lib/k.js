"use strict";

var _ = require('underscore'),
    glob = require('glob-whatev'),
    path = require('path');

_.mixin(require('./helpers'));

(function() {    
    
    var instances = [], // maintain an array of all `k()` instances    
        tasks = {};     // "global" registry of tasks

    function k(config) {

        // register a task on a given instance
        // NB: make sure function accepts a callback, and executes it when done
        function task(name, fn) {
            var t = this;
            if(typeof name !== 'string') {
                //sending in a hash
                _.each(name, function(f, n) {
                    task.apply(t, [n, f]);
                });
                return this;
            }

            if(!_.isFunction(fn)) {
                throw new Error('no function passed');
            }


            t[name] = function() {
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
            return t;
        }

        // simple cloning function
        function clone() {
            var conf = _.jsonclone(this.config);
            conf.files = _.jsonclone(this.files);
            return k(conf);
        }

        function init() {
            var t = this;

            this.config = config = _.extend({}, {
                src: './',
                dest: './dist'
            }, config || {});

            // import all registerd tasks onto this instance
            _.each(tasks, function(fn, name) {
                task.apply(t, [name, fn]);
            });

            // populate `this.files`
            this.files = this.config.files = this.config.files || _.map(glob.glob(path.join(config.src, '**/*.*')), function(path) {
                return {
                    src: path
                };
            });

            instances.push(t);
            return this;
        }

        var o = {
            task: task,
            clone: clone
        };

        init.apply(o);
        return o;
    }

    // register a task globally across instances
    k.task = function(name, fn) {
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
            inst.task(name, fn);
        });

        return this;
    };

    // register the default tasks
    k.task(require('./tasks'));

    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = k;
        }
        exports.k = k;
    } else {
        this.k = k;
    }

    k.VERSION = '0.1';

}).call(this);