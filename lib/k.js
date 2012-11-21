var _ = require('underscore'),
    fs = require('fs'),
    glob = require('glob-whatev'),
    path = require('path'),
    _tasks = require('./tasks');

_.mixin(require('./helpers'));

(function(ctx) {
    var root = this;
    var instances = [];

    var tasks = {};

    function k(config) {

        function init() {
            var t = this;
            
            this.config = config = _.extend({}, {
                src: './',
                dest: './'
            }, config || {});

            _.each(tasks, function(fn, name) {
                task.apply(t, [name, fn]);
            });

            this.files = this.config.files = this.config.files || _.map(glob.glob(path.join(config.src, '**/*.*')), function(path){
                return {src:path};
            });

            instances.push(t);
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

            if(!_.isFunction(fn)){
                throw new Error('no function passed');
            }

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

        function clone() {
            var conf = _.jsonclone(this.config);
            conf.files = _.jsonclone(this.files);
            return k(conf);
        }


        var o = {
            task: task,
            clone: clone
        };

        init.apply(o);
        return o;
    }

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
    };

    k.task(_tasks);

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