var kir = require("../index.js");
var fs = require('fs');
var path = require('path');

kir.source("file", (source) => {
    
    source.resolve((ressource) => {
        var file = ressource.description;
        file = file.indexOf(".js") > 0 ? file : file + ".js";
        
        var len = ressource.getSearchPath().length;
        for (var i = 0; i < len; i++) {
            var base = ressource.getSearchPath()[i];
            var p = base + "/" + file;
            
            try {
                var stats = fs.statSync(p);
            } catch (error) {
                continue;
            }
            ressource.name = path.basename(p,'.js');
            if(ressource.name=="index" || ressource.name=="main")
                ressource.name= path.basename(path.dirname(p));
            ressource.includes.push(p);
            ressource.package.push(p);
            
            return kir.steam.of(ressource);
        }
        throw "File not found "+ressource.description;
    });

    source.include((ressource) => {
        return kir.steam.from(ressource.includes)
            .map(f=>{
                var ret = require(f);
                if(ret.name)
                    ressource.name=ret.name;
                return ret;
            });
    });

    source.copyto((dir)=> {
        return source.files()
            .stream()
            .callback((c,v)=>fs.createReadStream('test.log').pipe(fs.createWriteStream('newLog.log')))
            
    });
});