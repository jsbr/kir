var kir = require(__dirname + "/../index.js");
var path = require("path");
//var vfs = require('vinyl-fs'); //todo add as plugin

module.exports = kir.plugin("gulp", plugin => {

    plugin.plugins([
        "npm;gulp-watch",
        "npm;vinyl-fs"
    ]);

    plugin.steam({
        pipe: function(stream) {
            return kir.steam.create(function(emit, value) {
                stream.on('data', file => console.log("data"));
                stream.on('close', () => console.log("close"));
                stream.on('error', e => console.log("error"));
                stream.on('end', e => console.log("end"));
                if (stream.hasOwnProperty("_transform"))
                    stream._transform(value, value.encoding || "utf-8", function(a, b) {
                        if (a)
                            emit.error(a).end();
                        else
                            emit.next(b).end();
                    });
            });
        },

        save: function(path) {

        },

        files: function(globs, options) {
            options = options || {};
            return kir.steam.create(function(emit) {
                var s = plugin.$('vinyl-fs').src(globs, options);
                s.on('data', function(file) { console.log("data"); emit.next(file); });
                s.on('close', function() { console.log("close");emit.end(); });
                s.on('end', function() { console.log("end"); });
                s.on('error', function(e) { console.log("error");emit.error(e); });
            });
        },
        
        watch:function(globs, options){
            options = options || {};
            return kir.steam.create(function(emit) {
                console.log();
                var s = plugin.$('vinyl-fs').src(globs, options);
                if(kir.props.watch)
                    s=s.pipe(plugin.$("gulp-watch")(globs, options));
                s.on('data', function(file) { console.log("data"); emit.next(file); });
                s.on('close', function() { console.log("close");emit.end(); });
                s.on('end', function() { console.log("end"); });
                s.on('error', function(e) { console.log("error");emit.error(e); });
            });
        }
    });

    plugin.properties({
        "include":["."],
        "exclude":[]
    });

    plugin.task("walk", function() {
        if(kir.props.watch)
            return plugin.$watch("E:\\Perso\\kir\\exemple\\test\\src\\*.txt",null);
        return plugin.$files("E:\\Perso\\kir\\exemple\\test\\src\\*.txt",null);
    }).private(true);


    plugin.onAttach(project => {

    });

});