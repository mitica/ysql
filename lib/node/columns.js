'use strict';

var Node  = require(__dirname);

var ColumnsNode = Node.define({
  _type: 'COLUMNS',
  _minNodes: 1,
  _validNodes: ['SELECT','COLUMN','PARAM','VALUE','EXPRESSION','FUNC']
});

module.exports = ColumnsNode;