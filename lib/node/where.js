'use strict';

var Node  = require(__dirname);

var WhereNode = Node.define({
  _type: 'WHERE'
});

module.exports = WhereNode;