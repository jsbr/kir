var Emitter = require(__dirname + '/emit.js');

function StreamProcess(action, emit, parent,listenType) {
    this._action = action;
    this._emit = emit;
    this._parent = parent;
    this._listenType = listenType;
   
    this.state = StreamProcess.WAIT;
    this._count = 0;
}

StreamProcess.PROCESS = 0;
StreamProcess.WAIT = 1;
StreamProcess.FAIL = 2;
StreamProcess.COMPLETE = 3;


StreamProcess.prototype = {

    execute: function(value) {
        var self=this;
        if (this._parent)
            this._attachToParent(this._parent.execute(value));
        else
            setTimeout(function(){self._call(value);},1);
        return this;
    },

   
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



     _call: function(value) {
        if (this._disposed) return;
        
        this._count++;
        this.state = StreamProcess.PROCESS;
        
        var self=this;
        var emit = new Emitter();
        emit.onNext(function(v) { self._dispatchNext(v)});
        emit.onError(function(e) { self._dispatchError(e)});
        emit.onEnd(function() {
            self._count--;
            if (self._count <= 0) {
                self.state = StreamProcess.WAIT;
                self._dispatchEnd();
            }
        });
        
        try{
            this._action(emit, value);
        }
        catch(e){
            this._emit.error(e);
        }
    },


    _attachToParent: function(parent) {
        var self = this;
        
        parent.next(function(v) {
            if(self._listenType === 0)
                self._call(v);
        });
        parent.error(function(e) {
            if(self._listenType == 2)
                self._call();
            self._dispatchError(e);
        });
        parent.end(function() {
            if(self._listenType == 1)
                self._call();
            self._dispatchEnd();
        });
    },
    
    _dispatchNext:function(v) {
        this._emit.next(v);
    },

    _dispatchError:function(e) {
        this._emit.error(e);
    },

    _dispatchEnd:function() {
        if (!this._parent || (this._parent.state == StreamProcess.COMPLETE && this.state == StreamProcess.WAIT)) {
            this.state = StreamProcess.COMPLETE;
            this._emit.end();
        }
    },

    dispose: function() {
        if (this._disposed)
            return;
        this._disposed = true;
        if (this._parent)
            this._parent.dispose();
        this._complete();
    }
};

module.exports = StreamProcess;