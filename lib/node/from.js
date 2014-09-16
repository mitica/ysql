'use strict';

var Node = require(__dirname);

var FromNode = Node.define({
  _type: 'FROM',

  getArrayItemType: function(name){
    return 'COLUMN';
  }
});

module.exports = FromNode;