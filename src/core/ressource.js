var utils = require(__dirname + '/utils.js');
var steam = require('../steam/steam.js');
var data = require('./data.js');
//require('../source/file.js');

/**
 * @param {String} source - source name for retriev the ressource
 * @param {String} description - description is used for identify the ressource
 * @param {String} version
 * @class
 */
function Ressource(description, source, version) {
    this.name = description;
    this.description = description;
    this.source = source || "file";
    this.version = version;
    this.dependencies = [];
    this.includes = [];
    this.package = [];
    this._searchPath = [];
}

Ressource.prototype = {
    searchPath: function(path) {
        this._searchPath.push(path);
        return this;
    },

    getSearchPath: function() {
        return this._searchPath;
    }
};


function findInCache(ressource) {
    return null;
}

function saveInCache(ressource) {
    return null;
}

function findInLocalRessource(ressource) {
    return null;
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

/**
 * @namespace ressource
 */
module.exports = {

    createAll: function(ressources) {
        return steam.from(ressources).act(this.create);
    },

    create: function(ressource) {
        if (typeof ressource == "string") {
            var s = ressource.split(";");
            if (s.length == 1)
                return new Ressource(s[0]);
            return new Ressource(s[1], s[0], s[2]);
        }
        else if (ressource instanceof Ressource)
            return ressource;
        return new Ressource(ressource.name, ressource.source, ressource.version);
    },

    resolve: function(ressource) {
        return steam.of(ressource)
            .act(findInLocalRessource)
            .when(null, steam.act(findInCache))
            .when(null, data.sources[ressource.source].resolve().call(ressource));
    },

    include: function(ressource) {
        return data.sources[ressource.source].include().call(ressource);
    },

    resolveAll: function(ressources) {
        return steam.from(ressources)
            .act(resolve);
    }
};
