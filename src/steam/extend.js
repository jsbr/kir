var Stream = require(__dirname + '/stream.js');
var Emitter = require(__dirname + '/emit.js');
var utils = require(__dirname + '/utils.js');

//create Stream
Stream.extends({
    /*
     * Create a new Stream
     * @param {Function} stream function receive {@link Emitter} as parameter
     * @returns {Stream}
     * 
     * @method Stream#create
     * @see steam.create
     * 
     * 
     */
    /**
     * Create a new Stream
     * @param {Function} stream function receive {@link Emitter} as parameter
     * @returns {Stream}
     * 
     * @memberOf steam
     * @see Stream.create
     * 
     * @example
     * steam.create((e) => e.next(1).next(2).end())
     * // send: 1,2,end()
     */
    create: function(stream) {
        return new Stream(stream);
    },

    /**
     * Create a empty Stream
     * @returns {Stream}
     * 
     * @method Stream#empty
     * @see steam.empty
     */
    /**
     * Create a empty Stream
     * @returns {Stream}
     * 
     * @memberOf steam
     * @see Stream.empty
     */
    empty: function() {
        return new Stream(function(emit) { emit.end(); });
    },

    /**
    * Create a Stream that ship specified value
    * @param {Any} value 
    * @returns {Stream}
    * 
    * @method Stream#empty
    * @see steam.empty
    */
    /**
     * Create a Stream that ship specified value
     * @param {Any} value
     * @returns {Stream}
     * 
     * @memberOf steam
     * @see Stream.empty
     */
    of: function(value) {
        return new Stream(function(emit, v) { emit.next(value).end(); });
    },

    promise: function(promise) {
        return new Stream(function(emit, v) {
            promise.then(function(x) {
                emit.next(x).end();
            });
        });
    },

    /**
     * @param {Array | Object} [iterable]
     * @return {Stream}
     * 
     * @method Stream#from
     * @see steam.from
     * 
     */
    /**
     * @param {Array | Object} [iterable]
     * @return {Stream}
     * 
     * @method Stream#from
     * @see steam.from
     * 
     * @todo review rename it something like sequence.
     */
    from: function(iterable) {

        return new Stream(function(emit, value) {
            if (!iterable)
                iterable = value;
            if (iterable instanceof Function)
                iterable = iterable(value);

            if (Array.isArray(iterable))
                iterable.forEach(function(x) {
                    emit.next(x);
                });
            else
                for (var ind in iterable)
                    emit.next({ key: ind, value: iterable[ind] });
            emit.end();
        });
    },

    act: function(obj) {
        return new Stream(function(emit, v) {
            var result = obj(v);
            if (typeof result == "undefined")
                emit.end();
            else if (result instanceof Promise)
                result.then(function(x) { emit.next(x).end(); });
            else if (result instanceof Stream)
                result
                    .execute(v)
                    .next(function(x) { emit.next(x); })
                    .end(function() { emit.end(); })
                    .error(function(e) { emit.error(e); });
            else
                emit.next(result).end();
        });
    },

    convert: function(obj) {

        if (obj instanceof Stream)
            return obj;

        if (obj instanceof Promise)
            return Stream.act.promise(obj);

        if (obj instanceof Function)
            return Stream.act.action(obj);

        if (typeof obj != "undefined")
            return Stream.act.of(obj);
        return Stream.act.empty();
    },

    callback: function(func) {
        return new Stream(function(emit, v) {
            var callback = function() {
                emit.next([].slice.call(arguments)).end();
            };
            func(callback, v);
        });
    }
});

//join
Stream.extends({
    
    /**
     * @todo to rename
     */
    or: function(steam) {
        var nextCalled = false;
        return new Stream(function(emit, v) {
            steam
                .execute(v)
                .next(function(v2) { nextCalled = true; emit.next(v2); })
                .error(function(e) { emit.error(e); })
                .end(function() { nextCalled ? emit.end() : emit.next(v).end(); });
        });
    },
    
    /**
    * @todo add possibility to make multiple test in once (equivalent to switch case)
    */
    when: function(condition, stream) {
        return new Stream(function(emit, v) {
            if (utils.validate(v, condition))
                stream
                    .execute(v)
                    .next(function(v2) { emit.next(v2); })
                    .error(function(e) { emit.error(e); })
                    .end(function() { emit.end(); });
            else
                emit.next(v).end();
        });
    }
});

//modifer
Stream.extends({
    filter: function(condition) {
        return new Stream(function(emit, v) {
            if (utils.validate(v, condition))
                emit.next(v);
            emit.end();
        });
    },

    map: function(value) {
        if (value instanceof Function)
            return new Stream(function(emit, v) {
                emit.next(value(v)).end();
            });
        else
            return Stream.act.of(value);
    }
});

