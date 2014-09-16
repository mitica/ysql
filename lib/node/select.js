'use strict';

var _     = require('lodash');
var Node  = require('./');

var SelectNode = Node.define(_.extend({
  type: 'SELECT',
  ION: 'FA',

  constructor: function(data) {
    Node.call(this, 'SELECT');
    if(data && {}.constructor === data.constructor){
      this.init(data);
    }
  },

  getArrayItemType: function(name){
    return 'COLUMN';
  }
}));

module.exports = SelectNode;