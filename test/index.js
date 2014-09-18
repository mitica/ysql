'use strict';

var Parser = require('../lib').Parser;
var parser = new Parser();
var fs = require('fs');

var testname = '1';
if (process.argv.length > 2) testname = process.argv[2];

var ysql = fs.readFileSync(__dirname + '/yml/' + testname + '.yml', 'utf8');

parser.load(ysql);

console.log(parser.toSql());
//console.log(query._type);