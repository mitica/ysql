'use strict';

var Node  = require(__dirname);

var OperatorNode = Node.define({
  _type: 'OPERATOR',
  _maxNodes: 0
});

module.exports = OperatorNode;