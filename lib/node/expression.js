'use strict';

var Node  = require(__dirname);

var ExpressionNode = Node.define({
  _type: 'EXPRESSION',
  left: null,
  right: null,
  operator: null
});

module.exports = ExpressionNode;