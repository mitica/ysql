'use strict';

var Node = require('./node'),
  Query = require('./query'),
  getDialect = require('./dialect'),
  DEFAULT_DIALECT = 'postgres',
  _ = require('lodash');

var Parser = function(config) {
  this._config = config || {};
}

Parser.prototype.load = function(data, config, format) {
  if (_.isString(config)) {
    config = null;
    format = config;
  }
  config = config || this._config;
  if (!_.isPlainObject(data)) {
    format = format || 'yml';
    if (!_.isString(format)) {
      throw new Error('invalid "format" parameter');
    }
    format = format.toLowerCase();
    if (format == 'json') {
      data = JSON.parse(data);
    } else {
      var yaml = require('js-yaml');
      data = yaml.safeLoad(data);
    }
  }

  this._node = new Query(data);
}

Parser.prototype.toSql = function(dialect) {
  if (!(this._node && this._node instanceof Node)) {
    throw new Error('You have to call \'load\' method first');
  }

  var d = getDialect(dialect || DEFAULT_DIALECT);
  return d.toSql(this._node);
}

module.exports = Parser;