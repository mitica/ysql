'use strict';

var _     = require('lodash');
var Node = require('./');

//var LIST_NAMES = ['list','columns','params','parameters'];

var FromNode = Node.define(_.extend({
  type: 'FROM',

  constructor: function() {
    Node.call(this);
  },

  /*setParam: function(name, value){
    var lname = name.toLowerCase();
    if(LIST_NAMES[lname]){
      name = 'nodes';
    }
    Node.setParam.call(this, name, value);
  },*/

  getArrayItemType: function(name){
    return 'COLUMN';
  }
}));

module.exports = FromNode;