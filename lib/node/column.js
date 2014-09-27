'use strict';

var Node = require(__dirname);

var ColumnNode = Node.define({
  _type: 'COLUMN',
  //_invalidNodes
  _maxNodes: 0,
  //_requiredFields: ['name']
  _defaultValueParam: 'name'
});

module.exports = ColumnNode;