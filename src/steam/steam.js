var Stream = require('./stream.js');
var extension = require('./extend.js');

/**
 * A namespace.
 * @namespace steam
 */
var steam = Stream.act;
steam.enableNodeExtension=function(){
    require('./extend_node.js');
}
module.exports = steam;
