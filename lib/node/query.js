'use strict';

var _     = require('lodash');
var Node = require('./');

var QueryNode = Node.define(_.extend({
  type: 'QUERY',
  isSubquery: true,

  constructor: function(data) {
    Node.call(this);
    if(data && {}.constructor === data.constructor){
      this.init(data);
    }
  }
}));

module.exports = QueryNode;