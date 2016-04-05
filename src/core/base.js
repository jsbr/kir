
var Properties = require('./properties.js');
var Task = require('./task.js');
var ressource = require('./ressource.js');
var steam = require('../steam/steam.js');

/**
 * @abstract
 * @class
 */
function ActivityBase(name) {
    this.name = name;

    this._stream = steam.of(this);
    this.props = new Properties();
    this.config = Properties.create({
        "base": __dirname,
        "project.base": __dirname
    });

    this._plugins = {};
    this._includes = {};
    this._tasks = {};
}

ActivityBase.prototype = {


    /**
     * @param {String} prop
     */
    /**
     * @param {Object} prop
     */
    properties: function(prop) {
        if (typeof prop == String)
            throw "TODO";
        else
            this.props.$apply(prop);

    },


    /**
     * Create {@link Task}
     * @param {String} name - task name
     * @param {Function | Object} [tsk] - append a function to execute to the task or apply property.
     * @retuns {Task}
     */
    task: function(name, tsk) {
        if (!(name in this._tasks)) {
            var task = new Task(this, name, tsk);
            this._tasks[name] = task;
            this._addQuickAcess(name, task);
        }
        return this._tasks[name];
    },


    /**
     * load a resource (exp: script) that can be used into the build script
     * @param {String[] | Object} obj
     */
    plugins: function(obj) {
        var ress = null;
        var stream = ressource.createAll(obj)
            .next(r => r.searchPath(__dirname + "/../plugins"))
            .next(r => ress = r)
            .act(ressource.resolve)
            .act(ressource.include)
            .next(p => {
                var name = p.name || ress.name;
                this._plugins[name] = p;
                this._addQuickAcess(name, p);
            })
            .act(p=>{
                if(p.stream)
                    return p.stream;
                return p;
            });

        return this._add(stream);
    },

    /**
     * @param {string} name
     * @return {Plugin}
     */
    plugin: function(name) {
        return this._plugins[name];
    },


    includes: function(obj) {
        var ress = null;
        var stream = ressource.createAll(obj)
            .next(r => ress = r)
            .next(r => r.searchPath(this.config.base))
            .act(ressource.resolve)
            .act(ressource.include)
            .next(prj => this._addQuickAcess(prj.name || ress.name, prj))
            .act(prj=>{
                if(prj.stream)
                    return prj.stream.of(prj);
                return prj;
            })
            .from(prj => prj.tasks)
            .filter(entry=> entry.key != "tasks")
            .act(entry => this.task(entry.key).dependOn(entry.value).description(entry.value.props.description));
            
        return this._add(stream);
    },

    $: function(path) {
        var p = path.split(".");
        var parent=this;
        var search=p.shift();
        var result=this["$" + search];
        if(p.length)
            return result.$(p.join("."));
        return result;
    },

    /**
     * @return {Array.<Task>}
     */
    get tasks() {
        return this._tasks;
    },
    
    get stream(){
        return this._stream;
    },

    /**
     * @private
     */
    _addQuickAcess: function(name, value) {
        this["$" + name] = value;
    },

    _add: function(stream) {
        this._stream = this._stream.chain(stream);
        return stream;
    },
};

module.exports = ActivityBase;