'use strict';

var Node  = require(__dirname);

var ValueNode = Node.define({
  _type: 'VALUE'
});

module.exports = ValueNode;