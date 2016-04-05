var chai = require('chai');
var Emitter = require('../../src/steam/emit.js');
var should = chai.should();
var assert = chai.assert;

describe("kir.steam.Emit", function() {
    it("should be able to create Emitter", function() {
        new Emitter().should.instanceof(Emitter);
    });
    
    it("should be able to emit and listen next", function(done) {
        var e = new Emitter();
        e.onNext(() => done());
        e.next();
    });
    
    it("should be able to emit and listen end", function(done) {
        var e = new Emitter();
        e.onEnd(() => done());
        e.end();
    });
    
    it("should be able to emit and listen error", function(done) {
        var e = new Emitter();
        e.onError(() => done());
        e.error();
    });
    
     it("should be throw error when error is not listen", function() {
        var e = new Emitter();
        try{
            e.error();
            assert.fail("not throw error")   ;
        }
        catch(error){}
    })
    
    it("should be able to emit a value and listen next", function(done) {
        var e = new Emitter();
        e.onNext(a => {
            a.should.be.equal(1);
            done();
        });
        e.next(1);
    });
    
    it("should be able to emit a value and listen error", function(done) {
        var e = new Emitter();
        e.onError(a => {
            a.should.be.equal(1);
            done();
        });
        e.error(1);
    });
    
    it("should be able to dispose next listener", function() {
        var e = new Emitter();
        var d = e.onNext(() => assert.fail("not disposed"))
        d.dispose();
        e.next();
    });
    
    it("should be able to dispose end listener", function() {
        var called=false;
        var e = new Emitter();
        var d = e.onEnd(() => assert.fail("not disposed"));
        d.dispose();
        e.end();
    });
    
    it("should be able to dispose error listener", function() {
        var called=false;
        var e = new Emitter();
        var d= e.onError(() => assert.fail("not disposed"));
        d.dispose();
        try{
            e.error();
        }
        catch(error){}
    });
});