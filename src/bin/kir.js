#!/usr/bin/env node

var program = require('commander');
var process = require('process');
var kir = require('../index.js');
var path = require('path');

function props(val) {
  var result = {};

  val.split(',').forEach(function(item) {
    var s = item.split("=");
    result[s[0]] = s[1];
  });
}

function increaseVerbosity(v, total) {
  return total + 1;
}

program
  .version('0.0.1')
  .usage('[options] [task...]')
  .option('-f, --file <file>', 'kir js file')
  .option('-p, --properties <items>', 'A list of properties (debug=true,project.title=kiki)', props)
  .option('-V, --verbose', 'A value that can be increased', increaseVerbosity, 0)
  .option('-v, --version', 'print version')
  .option('-w, --watch', '')
  .parse(process.argv);

kir.props={
    "watch": program.watch,
    "verbose": program.verbose,
};

console.log("");
var file = process.cwd() + "/" + (program.file || "kirfile.js");
var prj = require(file);

kir.mainProject.base(path.dirname(file)).run(program.args, program.properties);
