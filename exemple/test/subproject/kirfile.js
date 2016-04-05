/*eslint-env es6*/
var kir = require(__dirname + "/../../../src/index.js");

module.exports=kir.project("subproject", project => {
    
    
    project.task("hello2", () => {
        console.log("Hello2 world");
    }).description("show Hello world2");
    
    project.task("hello", () => {
        console.log("Hello world subproject");
    }).description("show Hello world");
    
    
    
    project.task("default2", () => {
        return project.$gulp.$files("src/*.*")
            .next((f)=>console.log("file",f));
    });
    
});
