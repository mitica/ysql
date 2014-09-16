'use strict';

var Node = require(__dirname);

var FromNode = Node.define({
  type: 'FROM',

  getArrayItemType: function(name){
    return 'COLUMN';
  }
});

module.exports = FromNode;