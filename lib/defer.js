// via https://github.com/juandopazo/yui3-gallery/blob/master/src/gallery-deferred/js/NodeDeferred.js
"use strict";
var _ = require('underscore');
_.mixin(require('underscore.deferred'));


(function() {

    function D(config) {
        this.host = config.host;
        this._config = config;
    }

    D.prototype.then = function(successFn) {
        return new _.Deferred().resolve().then(successFn).promise();
    };

    _.extend(D, {
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

                    return callback ? deferred.then(callback) : deferred.promise();
                }); //todo - .fail
                return next.promise(new D(this._config));
            };
            return this;
        },

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
