'use strict';

var Node = require(__dirname);

var QueryNode = Node.define({
  type: 'QUERY',
  isSubquery: true
});

module.exports = QueryNode;