var Stream = require(__dirname + '/stream.js');
//create Stream
Stream.extends({

    /**
     * 
     */
    nodeStream: function(func) {

        return new Stream(function(emit, v) {
            var stream = func(v);

            stream.on('data', data => emit.next(data));
            stream.on('close', () => {console.log("close");emit.end()});
            stream.on('error', e => emit.error(e));

        });
    }
});

