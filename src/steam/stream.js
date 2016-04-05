/// "eslint.enable": true
//TODO rename Stream
var StreamProcess = require(__dirname + '/process.js');
var utils = require(__dirname + '/utils.js');
var Emitter = require(__dirname + '/emit.js');

/**
 * @class
 */
function Stream(action) {
    this.action = action;
    this._endCallback = [];
    this._errorCallback = [];
    this.parent = null;
    this._emit = new Emitter();
    this.listenType = Stream.LISTEN_NEXT;
}

Stream.LISTEN_NEXT = 0;
Stream.LISTEN_END = 1;
Stream.LISTEN_ERROR = 2;

Stream.prototype = {

    //Listener
    next: function(func) {
        this._emit.onNext(func);
        return this;
    },
    end: function(func) {
        this._emit.onEnd(func);
        return this;
    },
    error: function(func) {
        this._emit.onError(func);
        return this;
    },

    //configure
    listen: function(type) {
        this.listenType = type;
        return this;
    },

    //Join
    merge: function(value) {
        var self = this;
        return this.join(Stream.create(function(emit, v) {
            var steam = value;
            if (steam instanceof Function)
                steam = value(v);
            steam
                .execute(v)
                .next(function(v2) { emit.next(v2); })
                .error(function(e) { emit.error(e); })
                .end(function() { emit.end(); });
        }));
    },

    chain: function(value) {
        return this.join(Stream.create(function(emit, v) {
            var steam = value;
            if (steam instanceof Function)
                steam = value(v);
            steam
                .execute(v)
                .next(function(v2) { emit.next(v2); })
                .error(function(e) { emit.error(e); })
                .end(function() { emit.end(); });
        }).listen(1));
    },
    
    watcher:function () {
       
    },

    join: function(steam) {
        steam.parent = this;
        return steam;
    },
    /**
    * consumes the stream
    * @param {any} value
    */
    execute: function(value) {
        return this.createProcess().execute(value);
    },

    createProcess: function() {
        if (this.parent)
            return new StreamProcess(this.action, this._emit.clone(), this.parent.createProcess(), this.listenType);
        return new StreamProcess(this.action, this._emit.clone(), this.listenType);
    },


};


/**
 * Create a new Stream
 * @param {Function} stream function receive {@link Emitter} as parameter
 * @returns {Stream}
 * @function
 * @todo remove
 */
Stream.create = function(stream) {
    return new Stream(stream);
};

Stream.act = {};

Stream.extend = function(name, func) {
    Stream.act[name] = func;
    Stream.prototype[name] = function() {
        return this.join(func(arguments[0], arguments[1], arguments[2], arguments[3]));
    };
};

Stream.extends = function(obj) {
    for (var ind in obj) {
        var steam = obj[ind];
        Stream.extend(ind, obj[ind]);
    }
    return obj;
};


module.exports = Stream;
