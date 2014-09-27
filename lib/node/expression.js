'use strict';

var Node  = require(__dirname);

var ExpressionNode = Node.define({
  _type: 'EXPRESSION',
  _minNodes: 3
});

module.exports = ExpressionNode;