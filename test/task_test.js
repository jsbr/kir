var chai = require('chai');
var Task = require('../src/core/task.js');
var steam = require('../src/steam/steam.js');
var should = chai.should();

var projectMock = {

};

describe("kir.Task", function() {

    it("instanciate Task no action", function() {
        new Task(projectMock, "unitTest")
    });

    it("create task and run it", function(done) {
        new Task(projectMock, "unitTest", function(task) {
            task.should.instanceof(Task);
            done();
        }).run();
    });


    it("create task and run with dependency", function(done) {
        var task2Executed = false;
        var task1 = new Task(projectMock, "unitTest", function(task) {
            task2Executed.should.be.true;
            done();
        });

        var task2 = new Task(projectMock, "unitTest2", function(task) {
            task2Executed = true;
        });
        task1.dependOn(task2).run();
    });

    it("create task and run with 2 dependency", function(done) {
        this.timeout(50000);
        var depend = 0;
        var task1 = new Task(projectMock, "unitTest", function(task) {
            depend++;
            depend.should.be.equal(3);
            done();
        });

        var task2 = new Task(projectMock, "unitTest2", function(task) {
            depend++;
        });

        var task3 = new Task(projectMock, "unitTest3", function(task) {
            depend++;
        });
        task1.dependOn(task2).dependOn(task3).run();
    });

    it("create task and run with 2 level of dependency", function(done) {
        var depend = 0;
        var task1 = new Task(projectMock, "unitTest", function(task) {
            depend.should.be.equal(3);
            done();
        });

        var task2 = new Task(projectMock, "unitTest2", function(task) {
            depend *= 3;
        });

        var task3 = new Task(projectMock, "unitTest3", function(task) {
            depend++;
        });
        task1.dependOn(task2.dependOn(task3)).run();
    });

    it("create task and capture return", function(done) {
        var task2 = new Task(projectMock, "unitTest2", function(task) {
            return 1;
        });

        var task1 = new Task(projectMock, "unitTest", function(task) {
            return task2.stream()
                .next(v => {
                    v.should.be.equal(1);
                    done();
                });
        });

        task1.run();
    });
});
