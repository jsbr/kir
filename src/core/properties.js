/**
 * @param {Properties} [parent]
 * TODO to review
 */
function Properties(parent) {
    this._parent = parent;
}

/**
 * @param {Object} obj
 * @param {Properties} [parent]
 */
Properties.create = function(obj, parent) {
    var prop = new Properties(parent);
    prop.$apply(obj);
    return prop;
};

Properties.prototype = {

    $apply: function(obj) {
        if (!obj) return;
        for (var ind in obj) {
            this.$set(ind, obj[ind]);
        }
    },

    $set: function(key, value) {
        var end = key.indexOf(".");
        if (end == -1)
            this[key] = value;
        else {
            var part = key.substring(0, end);
            if (!(part in this))
                this[part] = new Properties(this);
            this[part].$set(key.substring(end + 1), value);
        }
    },

    /**
     * @param {String} key
     */
    $get: function(key, def) {
        if (key in this)
            return this[key];
        var end = key.indexOf(".");
        if (end == -1)
            return this._parent ? this._parent.$get(key, def) : def;
        var part = key.substring(0, end);
        if (part in this)
            return this[part].$get(key.substring(end + 1), def);
        return def;
    }
};

module.exports = Properties;
