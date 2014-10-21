'use strict';

var Node = require(__dirname);

var FromNode = Node.define({
  _type: 'FROM',
  _minNodes: 1,
  _validNodes: ['SELECT', 'TABLE', 'JOIN', 'ON'],
  setParam: function(name, value, isDefault) {
    if (isDefault === true) {
      this.add(Node.createNode('TABLE', value))
      return;
    }

    Node.prototype.addParam(this, name, value);
  }
});

module.exports = FromNode;