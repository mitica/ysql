'use strict';
var _ = require('lodash');

/**
 * inspired from github.com/brianc/node-sql
 */

var assert = require('assert');
var util = require('util');

var Node = function(data) {
  //this.type = 'NODE';
  if (data && ({}.constructor === data.constructor || _.isArray(data))) {
    this.init(data);
  }
};

Node.prototype.toNode = function() {
  return this;
};

Node.prototype.init = Node.prototype.build = function(data) {
  if (data === undefined || data === null) {
    console.log('data in init node is NULL');
    return;
  }
  if (!_.isArray(data) && (_.isString(data) || _.isNumber(data) || !_.isPlainObject(data))) {
    console.log('invalid data in init: ' + data);
    return;
  }
  var self = this;

  if (_.isArray(data)) {
    data.forEach(function(item) {
      self.initItem(item);
      console.log(item.name);
    });
    console.log('processed array');
    return;
  }

  self.initItem(data);
}

Node.prototype.initItem = function(data) {
  var self = this;
  for (var param in data) {
    var lparam = param.toLowerCase(),
      uparam = param.toUpperCase(),
      node = null;

    if (uparam == param) {
      // is node type
      node = Node.createNode(param, data[param]);
      if (node) self.setParam(lparam, node);
    } else {
      // is node param name
      if (Array.isArray(data[param]) && data[param].length > 0) {
        data[param].forEach(function(item) {
          var itype = item['type'] || self.getArrayItemType(param);
          if (_.isString(itype)) {
            var inode = Node.createNode(itype, item);
            if (inode) self.add(inode);
            else {
              console.log('invalid list item node type: ' + param + ' = ' + itype);
            }
          } else {
            console.log('invalid list item type: ' + param + ' = ' + itype);
          }
        });
      } else {
        self.setParam(param, data[param]);
      }
    }
  }
}

Node.prototype.getArrayItemType = function(name) {
  return null;
}

Node.prototype.setParam = function(name, value) {
  this[name] = value;
}

var add = function(parent, node) {
  assert(node, 'Error while trying to add a non-existant node to a query');
  //this.nodes.push(typeof node === 'string' ? new TextNode(node) : node.toNode());
  if (!parent.nodes) parent.nodes = [];
  parent.nodes.push(node);
}

Node.prototype.add = function(node) {
  assert(node, 'Error while trying to add a non-existant node to a query');
  if (_.isArray(node)) {
    var self = this;
    node.forEach(function(n) {
      add(self, n);
    });
  } else add(this, node);
  return this;
};

Node.define = function(def) {
  var c = function(data) {
    Node.call(this, data);
  };
  // allow custom sub-class constructor
  if (def.constructor && def.constructor !== {}.constructor) {
    c = def.constructor;
  }
  util.inherits(c, Node);
  for (var key in def) {
    if (def.hasOwnProperty(key)) {
      c.prototype[key] = def[key];
    }
  }
  return c;
};

var NODES = ['QUERY', 'SELECT', 'FROM', 'COLUMN', 'ORDER', 'GROUP', 'COLUMNS'];

Node.createNode = function(name, data) {
  if (NODES.indexOf(name.toUpperCase()) > -1) {
    var n = new(require('./' + name.toLowerCase()))(data);
    //if (data !== undefined) n.init(data);
    return n;
  }
  console.log('(1) invalid node type: ' + name);
  return null;
};

module.exports = Node;