'use strict';

var Node  = require(__dirname);

var SelectNode = Node.define({
  type: 'SELECT',

  getArrayItemType: function(name){
    return 'COLUMN';
  },

  setParam: function(name, value){
    Node.prototype.setParam.call(this, name+1, value);
  }
});

module.exports = SelectNode;