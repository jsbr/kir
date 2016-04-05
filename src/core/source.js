var utils = require(__dirname + '/utils.js');
var ActivityBase = require('./base.js');

/** 
 * @class 
 * @extends ActivityBase
 */
function Source(name) {
    ActivityBase.call(this, name);
}

Source.prototype = {
    /**
     * Define the function to call for resolve/load the ressource
     * @param {Function} func - 
     * @return {Task}
     */
    resolve: function(func) {
        return this.task("resolve", (t,r)=>func(r));
    },
    /**
     * include the file for use in the build script
     * @param {Function} func
     * @return {Task}
     */
    include: function(func) {
         return this.task("include", (t,r)=>func(r)); 
   },
    files: function() { },
    copyto: function() { }
};

utils.extends(Source, ActivityBase);

module.exports=Source;