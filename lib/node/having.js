'use strict';

var Node  = require(__dirname);

var HavingNode = Node.define({
  _type: 'HAVING'
});

module.exports = HavingNode;