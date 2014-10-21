'use strict';

var Node  = require(__dirname);

var JoinNode = Node.define({
  _type: 'JOIN',
  _defaultValueParam: 'name'
});

module.exports = JoinNode;