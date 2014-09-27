'use strict';

var Node  = require(__dirname);

var ParamNode = Node.define({
  _type: 'PARAM',
  _defaultValueParam: 'name'
});

module.exports = ParamNode;