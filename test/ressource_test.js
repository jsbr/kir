var chai = require('chai');
var ressource = require('../src/core/ressource.js');
var expect = chai.expect;

require('../src/source/file.js');

describe("kir.Ressource", function() {
    
    it("create file ressource",function(done){
        ressource.resolve(ressource.create("assets/empty.js")
            .searchPath(__dirname))
            .execute()
            .next(v =>{
                expect(v.includes[0]).contains("empty.js");
                done();
            });    
    });
    
    it("include file ressource",function(done){
        ressource.resolve(ressource.create("assets/empty.js")
            .searchPath(__dirname))
            .act(ressource.include)
            .execute()
            .next(v =>{
                expect(v).be.equal("hello world");
                done();
            });    
    });
    
    xit("create npm ressource",function(done){
        this.timeout(100000);
        Ressource.create("npm;gulp-uglify").resolve()
            .end(()=>done())
            .execute();
    });
});