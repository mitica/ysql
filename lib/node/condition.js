'use strict';

var Node  = require(__dirname);

var ConditionNode = Node.define({
  _type: 'CONDITION',
  _minNodes: 1,
  _maxNodes: 1,
  _validNodes: ['EXPRESSION']
});

module.exports = ConditionNode;