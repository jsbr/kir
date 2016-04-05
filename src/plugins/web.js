/*eslint-env es6*/
var kir = require(__dirname + "/../index.js");

module.exports = kir.plugin("web", plugin => {

    plugin.steam({
        uglify: function() { },
        isJS: function() { },
        isCSS: function() { },
        isHTML: function() { }
    });



    plugin.plugins([
        "gulp"
    ]);


    plugin.properties({
        srcDir: "src",
        buildDir: "build",
        integrationTest: [],
        unitTest: [],
        testTool: "mocha"
    });

    //TASK

    plugin.task("clean", function() {

    }).properties({
        group: "build",
        description: "parse file into src directory (property.srcDir)",
        attachToParent: true
    });


    plugin.task("compile", function() {

        return plugin.$("gulp.walk")
            .call(plugin.props.srcDir)
            .act(f => console.log(f.path));

    }).properties({
        group: "build",
        description: "parse file into src directory (property.srcDir)",
        attachToParent: true
    });

    plugin.task("compile_dependencies", function() {

    }).properties({
        group: "build",
        description: "retrive dependencies",
        attachToParent: true
    });

});
