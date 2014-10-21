'use strict';

var Node  = require(__dirname);

var OnNode = Node.define({
  _type: 'ON',
  _defaultValueParam: 'name'
});

module.exports = OnNode;