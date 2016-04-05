/**
 * @class
 */
function Emitter(next,end,error) {
    this._next = next || [];
    this._end = end || [];
    this._error = error || [];
}

Emitter.prototype = {

    next: function(value) {
        this._next.forEach(function(f) {
            f(value);
        });
        return this;
    },
    
    end: function() {
        this._end.forEach(function(f) {
            f();
        });
        return this;
    },
    
    error: function(e) {

        if (this._error.length === 0)
            throw e;
        this._error.forEach(function(f) {
            f(e);
        });
        return this;
    },

    /**
     * @param {Function} func
     * @return {Emitter}
     */
    onNext: function(func) {
        this._next.push(func);
        return new EmitListener(func, this._next);
    },
    
    /**
     * @param {Function} func
     * @return {Emitter}
     */
    onEnd: function(func) {
        this._end.push(func);
        return new EmitListener(func, this._end);
    },
    
    /**
     * @param {Function} func
     * @return {Emitter}
     */
    onError: function(func) {
        this._error.push(func);
        return new EmitListener(func, this._error);
    },
    
    /**
     * @return {Emitter}
     */
    clone:function(){
        return new Emitter(this._next.concat([]),this._end.concat([]),this._error.concat([]));
    }
};


function EmitListener(func, list) {
    this._func = func;
    this._list = list;
}

EmitListener.prototype = {
    dispose: function() {
        var ind = this._list.indexOf(this._func)
        if (ind != -1)
            this._list.splice(ind, 1);
        this._func = null;
        this._list = null;
    }
}

module.exports = Emitter;
