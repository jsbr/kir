var chai = require('chai');
var steam = require('../../src/steam/steam.js');
var Stream = require('../../src/steam/stream.js');
var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;


describe("kir.steam", function() {


    describe("basic", function() {

        it("should be able to create steam", function() {
            var stream = steam.create(function(e) { });
            stream.should.instanceof(Stream);
        });

        it("should be able to execute a steam", function(done) {
            steam.create((e) => {
                done();
            }).execute();
        });

        it("should be able to create steam from list", function(done) {
            steam.from(["a", "b"]).execute().end(() => done());
        });

        it("should be able to create steam of value", function(done) {
            steam.of("b").execute().end(() => done());
        });

        it("should be able execute a steam and watch end", function(done) {
            steam.from(["a", "b"])
                .execute()
                .end(() => done());
        });

        it("should be able execute a steam and watch next", function(done) {
            steam.create(e => e.next(1).end())
                .execute()
                .next(() => done());
        });

        it("should be able execute a steam and watch error", function(done) {
            steam.create(e => { throw "error"; })
                .execute()
                .error(() => done());
        });

        it("should be able watch next and execute a steam", function(done) {
            steam.create(e => { e.next(1).end(); })
                .next(() => done())
                .execute();
        });

        it("should be able watch end and execute a steam", function(done) {
            steam.from(["a", "b"])
                .end(() => done())
                .execute();
        });

        it("should be able watch error and execute a steam", function(done) {
            steam.create(e => { throw "error"; })
                .error(() => done())
                .execute();
        });

        xit("should be throw error if error was not listen", function() {
            try {
                steam.create(e => { throw "error"; })
                    .execute();
                assert.fail("not throw error");
            }
            catch (e) { }
        });

    });

    describe("join", function() {

        it("should be able to merge 2 steam", function(done) {
            var a = [1, 2];
            var b = ["a", "b"];
            var cpt = 0;
            steam.from(a)
                .merge(steam.from(b))
                .next((v) => {
                    expect(v).to.be.equal(b[cpt % b.length]);
                    cpt++;
                })
                .execute()
                .end(() => {
                    expect(cpt).be.equal(4);
                    done();
                });
        });

        it("should be able to merge 3 steam ", function(done) {
            this.timeout(50000);
            var a = [1, 2];
            var b = ["a", "b"];
            var c = ["z", "x"];
            var cpt1 = 0;
            var cpt2 = 0;
            steam.from(a)
                .merge(steam.from(b))
                .next((v) => {
                    expect(v).to.be.equal(b[cpt1 % b.length]);
                    cpt1++;
                })
                .merge(steam.from(c))
                .next((v) => {
                    expect(v).to.be.equal(c[cpt2 % c.length]);
                    cpt2++;
                })
                .execute()
                .end(() => {
                    cpt1.should.be.equal(4);
                    cpt2.should.be.equal(8);
                    done();
                });
        });

        it("should be able to merge 1 steam to merged steam", function(done) {
            this.timeout(50000);
            var a = [1, 2];
            var b = ["a", "b"];
            var c = ["z", "x"];
            var cpt = 0;
            steam.from(a)
                .merge(steam.from(b).merge(steam.from(c)))
                .next((v) => {
                    expect(v).to.be.equal(c[cpt % c.length]);
                    cpt++;
                })
                .execute()
                .end(() => {
                    cpt.should.be.equal(8);
                    done();
                });
        });


        it("should be able to chain stream", function(done) {
            steam.from([0, 1])
                .chain(steam.from([5]))
                .next(v => {
                    expect(v).equal(5);
                    done();
                }).execute();
        });

        it("should be able merge if codition is valid using when", function(done) {
            steam.from([0, 1])
                .when(1, steam.of(0))
                .next(v => expect(v).equal(0))
                .execute()
                .end(() => done());
        });
    });

    describe("steam modifier", function() {
        it("should be able to filter value using a function", function(done) {
            var cpt = 0;
            steam.from(["a", "b"])
                .filter(function(v) {
                    return v != "a";
                })
                .next((v) => {
                    v.should.be.equal("b");
                    cpt++;
                })
                .end(() => {
                    cpt.should.be.equal(1);
                    done();
                })
                .execute();
        });
        it("should be able to filter value using a string", function(done) {
            var cpt = 0;
            steam.from(["a", "b"])
                .filter("b")
                .next((v) => {
                    v.should.be.equal("b");
                    cpt++;
                })
                .end(() => {
                    cpt.should.be.equal(1);
                    done();
                })
                .execute();
        });
        it("should be able to filter value using a int", function(done) {
            var cpt = 0;
            steam.from([1, 2])
                .filter(2)
                .next((v) => {
                    v.should.be.equal(2);
                    cpt++;
                })
                .end(() => {
                    cpt.should.be.equal(1);
                    done();
                })
                .execute();
        });

        it("should be able to filter object", function(done) {
            var cpt = 0;
            steam.from([{ a: 1 }, { a: 2 }])
                .filter({
                    a: 2
                })
                .next((v) => {
                    v.a.should.be.equal(2);
                    cpt++;
                })
                .end(() => {
                    cpt.should.be.equal(1);
                    done();
                })
                .execute();
        });
    });


    xdescribe("steam create advanced", function() {
        it("create stream from node stream", function(done) {
            var fs = require('fs');
            steam.enableNodeExtension();
            steam
                .nodeStream(() => fs.createReadStream('test/assets/empty.js').pipe(fs.createWriteStream('test/delete/empty2.js')))
                .execute()
                .end(() => done());
        })
    });
});
