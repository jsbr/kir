/*eslint-env es6*/
var Project = require('./core/project.js');
var Plugin = require('./core/plugin.js');
var Source = require('./core/source.js');
var data = require('./core/data.js');
var steam = require('./steam/steam.js');

var _projects = {};
var _plugins = {};
var _mainProject;
var _lastProjext;

steam.enableNodeExtension();

/**
 * @namespace kir
 */
var kir = {

  lastProjext:null,
  mainProject:null,

  steam:steam,
  props:{
      target:"release"
  },
  /**
   * @param {String} name
   * @param {Function} [func]
   * @returns {Project}
   */
  project: function(name, func) {
    if (name in _projects) {
      if (func) func(_projects[name]);
      return _projects[name];
    }

    var p = Project.create(name, func);
    p.dispose = () => delete _projects[name];

    _projects[name] = p;
    this.lastProjext = p;
    if (!_mainProject) this.mainProject = p;
    return p;
  },

  /**
   * @param {String} name - plugin name (should be the same of file name)
   * @param {Function} [init] - initialize function (Plugin)=>void
   * @returns {Plugin}
   */
  plugin:function(name, init){
      return Plugin.create(name, init);
  },
  
  /**
   * @param {String} name - source name
   * @param {Function} [init] - initialize function (Source) => void
   * @returns {Plugin}
   */
  source:function (name,init) {
      var source = data.sources[name];
      if(!source){
        source=new Source(name);
        data.sources[name] = source;
      }
      if(init)
        init(source);
      return source;
  }
};

module.exports = kir;

require('./source/file.js');
require('./source/npm.js');