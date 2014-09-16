'use strict';

var Json2Sql = require('../lib');
var yaml = require('js-yaml');
var fs = require('fs');

var testname = '1';
if (process.argv.length > 2) testname = process.argv[2];

var json = yaml.safeLoad(fs.readFileSync(__dirname + '/yml/' + testname + '.yml', 'utf8'));

var json2sql = new Json2Sql();

json2sql.load(json);

console.log(json2sql.toSql().text);
//console.log(query._type);