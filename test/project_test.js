var chai = require('chai');
var Project = require('../src/core/project.js');
var Plugin = require('../src/core/plugin.js');
var Task = require('../src/core/task.js');
var expect = chai.expect;

describe("kir.Project", function() {
    describe("basic", function() {
        it("create and initialize project ",function (done) {
            var prj=Project.create("project",function (prj) {
                expect(prj).instanceof(Project);
                expect(prj.name).be.equal("project");
                done();
            }).run();
        });


        it("create task",function () {
            var tsk=Project.create("project").task("task");
            expect(tsk).instanceof(Task);
            expect(tsk.name).be.equal("task");
        });

        it("create plugins",function (done) {
            require('../src/source/file.js');
            Project.create("project")
                .plugins(["gulp"])
                .execute()
                .next((plugin)=>{
                    expect(plugin).instanceof(Plugin);
                    expect(plugin.name).be.equal("gulp");
                    done();   
                });
        });
    });
});
