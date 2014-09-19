
var Node = require('./node'),
  getDialect = require('./dialect'),
  DEFAULT_DIALECT = 'postgres',
  _ = require('lodash');

var Query = function(config) {
  this._config = config || {};
}

Query.prototype.parse = function(data, config, format) {
  if (_.isString(config)) {
    format = config;
    config = null;
  }
  config = config || this._config;
  if (_.isString(data)) {
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

  var node = Node.detectNode(data);
  if(node){
    this._node = Node.createNode(node.name, node.data);
    return this;
  }
  throw new Error('data is not in a valid YSQL format: ' + JSON.stringify(data));
}

Query.prototype.toSql = function(dialect) {
  if (!(this._node && this._node instanceof Node)) {
    throw new Error('You have to call \'parse\' method first');
  }

  var d = getDialect(dialect || DEFAULT_DIALECT);
  return d.toSql(this._node);
}

module.exports = Query;