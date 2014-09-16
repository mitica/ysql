'use strict';

var getDialect = function(name) {
  var name = name.toLowerCase();
  switch (name) {
    case 'postgres':
      return require('./' + name);
    default:
      throw new Error(dialect + ' is unsupported');
  }
}

module.exports = getDialect;