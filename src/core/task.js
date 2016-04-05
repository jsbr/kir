var steam = require(__dirname + '/../steam/steam.js');
var fs = require('fs');
var Properties = require('./properties.js');
/**
 * @class
 */
function Task(project, name, action) {
    this.name = name;
    
    this.project = project;
    this._stream = null;
    
    this.props = Properties.create({
        description: "",
        group:"other",
        private:false,
        attachToParent:false,
        depends: []
    }, project.prop);


    if(action instanceof Function)
        this.action=action;
    else if (action)
        this.props.$apply(action);
}

Task.prototype = {

    properties: function(prop) {
        this.props.$apply(prop);
    },

    create: function(action) {
        this.action = action;
    },

    description: function(value) {
        this.props.description = value;
        return this;
    },
    
    private: function(value) {
        this.props.private = value;
        return this;
    },
    
    group:function(value){
        this.props.group=value;
        return this;
    },

    dependOn: function(depend) {
        this.props.depends.push(depend);
        return this;
    },
    
    attachToParent:function(value){
         this.props.attachToParent = true;
        return this;
    },

    /**
     * create task stream
     * @param {...*} args
     */
    stream: function(args) {
        args = [].slice.call(arguments);
        args.unshift(this);
        return steam.from(this.props.depends)
            .merge((d) => d.stream())
            .chain(() => {
                //console.log(":" + this.name);
                return steam.convert(this.action ? this.action.apply(this,args) || this: this);
            });
    },

    print: function(prefix) {
        if(this.props.private)
            return;
        prefix = prefix || "";
        console.log("*", prefix+this.name + " - " + this.props.description);
    },

    run: function() {
        return this.stream()
            .execute();
    }
};

Task.prototype.call = Task.prototype.stream;

module.exports = Task;
