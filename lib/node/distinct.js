'use strict';

var Node  = require(__dirname);

var DistinctNode = Node.define({
  _type: 'DISTINCT'
});

module.exports = DistinctNode;