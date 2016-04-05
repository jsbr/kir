/*eslint-env es6*/
var kir = require(__dirname + "/../../src/index.js");

kir.project("BuildTest", project => {
    
    project.plugins([
      "gulp",
      "web"
    ]);
    
    project.includes([
       "subproject/kirfile.js" 
    ]);
    
    project.task("hello", (task) => {
        task.description("show Hello world");
        console.log("Hello world");
    });
    
    project.task("default2", () => {
        return project.$gulp.$files("src/*.*")
            .next((f)=>console.log("file",f));
    });
    
});
