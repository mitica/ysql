'use strict';

var Node  = require(__dirname);

var TableNode = Node.define({
  _type: 'TABLE',
  _defaultValueParam: 'name'
});

module.exports = TableNode;