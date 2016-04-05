var kiki = require("kiki")

var plugins = kiki.pugins({
	"uglify": "npm:gulp-uglify:1.0.1"
})

kiki.project("Vanilla", project => {

	project.description = ""

	project.properties({

	})
    
    var plugins=project.plugins()

	project.dependencies([
		"vanilla.core",
		"npm:rxjs:*",
		"bower:most:*",
		{type:"bower",name:"most",version:"*"}
	])

	project.depends("vanilla.core", project => {

	})

	project.task("task", kiki.file("*.js"))
		.pipe(plugins.uglify())

	project.task("task")
		.pipe(project.plugins("web").isHTML())
		.pipe(plugins.web.isHTML())
        .isHTML()
        
	project.task("task", () => {
		kiki.file("*.js").pipe(kiki.save("output"))
	})

});

kiki.project("Vanilla")
	.properties({}).dependencies([

	])
