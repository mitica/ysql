'use strict';

var Node  = require(__dirname);

var ColumnsNode = Node.define({
  type: 'COLUMNS',

  getArrayItemType: function(name){
    return 'COLUMN';
  },
});

module.exports = ColumnsNode;