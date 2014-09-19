'use strict';

var Query = require('../lib').Query;
var query = new Query();
var fs = require('fs');

var testname = '1';
if (process.argv.length > 2) testname = process.argv[2];

var ysql = fs.readFileSync(__dirname + '/yml/' + testname + '.yml', 'utf8');

console.log(query.parse(ysql).toSql());
//console.log(query._type);