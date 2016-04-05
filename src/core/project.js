/*eslint-env es6*/

var Properties = require('./properties.js');
var Task = require('./task.js');
var steam = require('../steam/steam.js');
var utils = require('./utils.js');
var ActivityBase = require('./base.js');


function tasks(prj, prefix) {
    var name;
    prefix = prefix || "";
    for (name in prj._tasks) {
        prj._tasks[name].print(prefix);
    }
    for (name in prj._plugins) {
        tasks(prj._plugins[name], prefix + name + ".");
    }
    return null;
}

//todo to reivew
function tasks(prj, prefix, obj) {
    var name;
    for (name in prj.tasks) {
        var task = prj.tasks[name];
        task.props.__prefix__ = prefix;
        addTask(prj.tasks[name], obj);
    }
    for (name in prj._plugins) {
        tasks(prj._plugins[name], prefix + name + ".", obj);
    }
}

function addTask(task, obj) {
    if (!(task.props.group in obj))
        obj[task.props.group] = [];
    obj[task.props.group].push(task);
}

function showTaskList(prj) {
    result = {};
    tasks(prj, "", result);
    for (var group in result) {
        console.log("--- " + group + " ---");
        result[group].forEach(function(task) {
            task.print(task.props.__prefix__);
            //console.log("" + task.props.__prefix__ + task.name + " - " + task.props.description);
        });
    }
}

/**
 * @class
 * @param {String} name
 * @extends ActivityBase
 */
function Project(name) {
    ActivityBase.call(this, name);
    this.task("tasks",(task) =>  showTaskList(this)).description("show all task");
}

/**
 * @param {String} name
 * @param {Function} init
 * @return {Project}
 */
Project.create = function(name, init) {
    var prj = new Project(name);
    if (init)
        init(prj);
    return prj;
};

Project.projects = {};

Project.prototype = {

    base: function(path) {
        this.config.$set("base", path);
        this.config.$set("project.base", path);
        return this;
    },


    /**
     *
     * @param {String[]} tasks
     * @param {Object} props
     */
    run: function(tasks, props) {
        this.props.$apply(props);
        if (tasks && tasks.length === 0 && "default" in this._tasks)
            this._run("default");
        else if (tasks)
            tasks.forEach(t=>this._run(t));
        this._stream.execute();
    },

    _run: function(task) {
        this._add(steam.act((v) => {
            try {
                return this.$(task).stream();
            }
            catch (e) {
                throw "task " + task+ " not found";
            }
        }));
    }
};

utils.extends(Project, ActivityBase);
module.exports = Project;
