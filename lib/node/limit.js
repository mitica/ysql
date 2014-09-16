'use strict';

var Node  = require(__dirname);

var LimitNode = Node.define({
  _type: 'LIMIT'
});

module.exports = LimitNode;