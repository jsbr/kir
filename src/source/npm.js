var kir = require("../index.js");
var exec = require('child_process').exec;

kir.source("npm", (source) => {
    source.resolve((ressource) => {
        return spawnSteam("npm", ["install", ressource.name])
            .next(data =>{
                ressource.includes.push(ressource.name);
                ressource.package.push(ressource.name);
            })
            .map(data => ressource);
    });

    source.include((ressource) => {
        return kir.steam.from(ressource.includes)
            .map(f => {
                var ret = require(f);
                if (ret.name)
                    ressource.name = ret.name;
                return ret;
            });
    });
});


function spawnSteam(command, args) {
    return kir.steam.create(function(e) {
        console.log(command + " " + args.join(" "));
        //var p = exec(command + " "+ args.join(" "))
        child = exec(command + ' ' + args.join(" "),
            function(error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                    e.error(error);
                }
                else
                    e.next(stdout).end();
            });
    });

}