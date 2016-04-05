var fs = require('fs');

module.exports = {
    format: function(str, prj) {

    },

    exists: function(path) {
        try {
            fs.accessSync(path, fs.F_OK);
            return true;
        }
        catch (e) {
            return false;
        }
    },

    merge: function name(target) {
        var sources = [].slice.call(arguments, 1);
        sources.forEach(function(source) {
            Object.getOwnPropertyNames(source).forEach(function(propName) {
                Object.defineProperty(target, propName,
                    Object.getOwnPropertyDescriptor(source, propName));
            });
        });
        return target;
    },

    extends: function name(target, parent) {
        this.merge(target.prototype, parent.prototype)
    }
};