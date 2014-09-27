'use strict';

var Node  = require(__dirname);

var FuncNode = Node.define({
  _type: 'FUNC',
  _maxNodes: 1,
  _validNodes: ['PARAMS'],
  _defaultValueParam: 'name'
});

module.exports = FuncNode;