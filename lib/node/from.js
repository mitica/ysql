'use strict';

var Node = require(__dirname);

var FromNode = Node.define({
  _type: 'FROM',
  _minNodes: 1,
  _validNodes: ['SELECT','TABLE']
});

module.exports = FromNode;