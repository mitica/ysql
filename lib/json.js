'use strict';

var Node = require('./node');
var Query = require('./node/query');
var getDialect = require('./dialect');
var DEFAULT_DIALECT = 'postgres';

var Json = function(config) {
  this._config = config || {};
}

Json.prototype.load = function(data, config) {
  config = config || this._config;

  this._node = new Query(data);
}

Json.prototype.toSql = function(dialect) {
  if(!(this._node && this._node instanceof Node)){
    throw new Error('You have to call \'load\' method first');
  }

  var d = new(getDialect(dialect || DEFAULT_DIALECT))();
  return d.toSql(this._node);
}

module.exports = Json;