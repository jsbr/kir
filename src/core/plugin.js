var Stream = require(__dirname + '/../steam/stream.js');
var utils = require('./utils.js');
var ActivityBase = require('./base.js');

/**
 * @class
 * @param {String} name - plugin name
 * @extends ActivityBase
 */
function Plugin(name) {
    ActivityBase.call(this, name);
    this._streams = {};
}


/**
 * 
 * @param {String} name - plugin name
 * @param {Function} [init]
 * @return {Plugin}
*/
Plugin.create = function(name, init) {
    var p = new Plugin(name);
    if (init)
        init(p);
    return p;
};


Plugin.prototype = {

    /**
     * @param {Object.<string, Function>}} obj - 
     * @todo move to ActivityBase
     */
    steam: function(obj){
        this._streams = Stream.extends(obj);
        for(var ind in this._streams){
            this._addQuickAcess(ind,this._streams[ind]);
        }
    },
    
    /**
     * @todo move to ActivityBase
     * @todo to review
     */
    action:function (func) {
        throw "TODO";
    },
    
    onAttach:function (func) {
        
    }
};

utils.extends(Plugin, ActivityBase);
module.exports = Plugin;
