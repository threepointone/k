// via https://github.com/juandopazo/yui3-gallery/blob/master/src/gallery-deferred/js/NodeDeferred.js
"use strict";
var _ = require('underscore');
_.mixin(require('underscore.deferred'));


(function() {

    function D(config) {
        this.host = config.host;
        this._config = config;
    }

    _.extend(D.prototype, {
        // "and then?"
        then: function(successFn, failureFn) {
            return new _.Deferred().resolve().then(successFn).fail(failureFn).promise();
        },
        // run an arbitrary function that accepts a callback
        fn: function(fn) {
            var host = this.host;
            var next = this.then(function() {
                var deferred = new _.Deferred();
                fn.call(host, function() {
                    deferred.resolve();
                });
                return deferred.promise();
            });
            return next.promise(new D(this._config));
        }
    });

    _.extend(D, {
        // import a deferred version of the task/method, assuming this function takes a callback as its last param
        // makes it available on the chain
        deferMethod: function(method) {
            D.prototype[method] = function() {
                var host = this.host,
                    args = [].slice.call(arguments),
                    callback, next;

                if(typeof args[args.length - 1] === 'function') {
                    callback = args.pop();
                }

                next = this.then(function() {
                    var deferred = new _.Deferred();

                    host[method].apply(host, args.concat([function() {
                        deferred.resolve.apply(deferred, arguments);
                    }]));
                    //todo - .fail
                    return callback ? deferred.then(callback) : deferred.promise();
                });
                return next.promise(new D(this._config));
            };
            return this;
        },
        // import a synchronous method into the chain
        importMethod: function(method) {
            D.prototype[method] = function() {
                var args = arguments,
                    host = this.host;
                return this.then(function() {
                    host[method].apply(host, args);
                });
            };
            return this;
        }
    });

    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = D;
        }
        exports.D = D;
    } else {
        this.D = D;
    }

}).call(this);
