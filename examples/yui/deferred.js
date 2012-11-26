YUI.add('k-deferred', function(Y){

    Y.first = function(array){
        return array[0];
    };
    Y.last = function(array){
        return array[array.length-1];
    };


    Y.flatten = function (arr) {
        var i = 0;
        arr = Y.Lang.isArray(arr) ? arr.concat() : [arr];
        while (i < arr.length) {
            if (Y.Lang.isArray(arr[i])) {
                Array.prototype.splice.apply(arr, [i, 1].concat(arr[i]));
            } else {
                i++;
            }
        }
        return arr;
    };


    Y.pick = function(o,fn){
        var ret = {};
        Y.each(o, function(val, key){
            if(fn(val, key)){
                ret[key] = val;
            }
        });
        return ret;
    };
    // a thought - arrays are just a convenient way of having a numbered hash.

    // evolved version of for loops, with bonus of giving functionality similar to Y.map
    // n: number of iterations
    // f: iterator - will be called with index
    // return: array with collective returns of iterators
    Y.times = function(n, fn){
        var arr = [];
        for(var i = 0, j = n; i < j ; i++){
            arr.push(fn(i));
        }
        return arr;
    };

    // do a delay.
    // ms: duration of delay in ms
    // return: deferred
    Y.wait = function (ms) {
        return this.defer(function (deferred) {
          Y.later(ms, deferred, deferred.resolve);
        });
    };
    // add to all deferreds
    Y.Promise.prototype.wait = Y.wait;

    // takes a series of functions, all which are passed callbacks to be called when you're done
    // runs these functions in a queue, waiting for the previous callback to finish before executing the next one
    // protip, if you want to run a bunch of queues in parallel, use Y.when(Y.queue(), Y.queue()) etc
    // return: deferred
    Y.queue = function(){
        var args = Y.Promise._flatten(Y.Array(arguments)),
            promised = this;
        Y.times(args.length, function(i){
            var fn = args[i];
            promised = promised.defer(function(promise){
                fn(function(err, data){  // data will probably never be here
                    if(err){
                        promise.reject(err);
                        return;
                    }
                    promise.resolve(data);
                });
            });
        });
        return promised;
    };
    // add to all deferreds
    Y.Promise.prototype.queue = Y.queue;


    // takes a series of functions, all which are passed callbacks to be called when you're done
    // runs these functions in a parallel manner, waiting for all callbacks to be executed before resolving the returned deferred
    // awesome no? :) see samples for usage.
    // return: deferred
    Y.parallel = function(){
        var args = Y.Promise._flatten(Y.Array(arguments)),
            promised = this;
        return Y.when(Y.times(args.length, function(i){
            var fn = args[i];
            return promised.defer(function(promise){
                fn(function(err, data){
                    if(err){
                        promise.reject(err);
                        return;
                    }
                    promise.resolve(data);
                });
            });
        }));
    };
    // add to all deferreds
    Y.Promise.prototype.parallel = Y.parallel;

    // add logging to deferreds. useful for dev.
    Y.Promise.prototype.log = function(){
        var args = Y.Promise._flatten(Y.Array(arguments));
        return this.defer(function(deferred){
            Y.log.apply(Y, args);
            deferred.resolve();
        });
    };

    // if handler returns true, then attach handler again.
    // similar to .on, but can cancel it at any point by returning false
    // must work this out.
    Y.EventTarget.prototype.$once = function (evt, handler, scope){
        return this.once(evt,function(e){
            handler(e);
        });
    };

},'@VERSION@', {requires:['gallery-deferred']});
