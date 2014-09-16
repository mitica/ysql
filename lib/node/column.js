'use strict';

var _     = require('lodash');
var Node  = require('./');

var ColumnNode = Node.define(_.extend({
  type: 'COLUMN',

  constructor: function() {
    Node.call(this);
  }
}));

module.exports = ColumnNode;