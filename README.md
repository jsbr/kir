# KIR
Kir is a other build tool inspired by Gradle and Gulp.

## Exemple
```js
kir.project("Vanilla", project => {

  project.plugins([
      "gulp",
      "npm;gulp-uglify"
  ])
  
  project.includes([
      "submodule"
  ])

  project.task("build", task=>{
    return project.$gulp
      .$files("**/*.js")
  }).dependOn(project.$submodule.$build)

  project.task("build.prod", task=>{
    return project.task("build").call()
      .pipe(project.plugin("gulp-uglify")())
  })
})
```

## TODO
 * Stream Evaluate use RxJs or improve steam
 * Improve doc
 * Plugin cache
 * Improve / organise unit test