'use strict';

var Node  = require(__dirname);

var ColumnNode = Node.define({
  _type: 'COLUMN'
});

module.exports = ColumnNode;