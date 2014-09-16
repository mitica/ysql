'use strict';

var _ = require('lodash');
var assert = require('assert');
var util = require('util');

var NODES = [
  'AS',
  'COLUMN', 'COLUMNS',
  'DISTINCT',
  'GROUP',
  'FROM',
  'ORDER', 'OFFSET',
  'QUERY',
  'LIMIT',
  'SELECT',
  'TABLE'
];

var Node = function(data) {
  this._nodes = [];
  if (data) {
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

  var isvalue = Node.isValue(data);

  if (isvalue) {
    this.setParam('value', data);
    return;
  }
  var self = this,
    node = null;

  if (_.isArray(data)) {
    data.forEach(function(item) {
      node = Node.detectNode(item);
      if (!node) {
        console.log('not detected node: ' + item);
        return;
      }

      node = Node.createNode(node.name, node.data);
      if (!node) {
        console.log('not create node: ' + item);
        return;
      }
      self.add(node);
    });
    return;
  }

  for (var param in data) {
    var lparam = param.toLowerCase(),
      uparam = param.toUpperCase(),
      node = null,
      item = data[param];

    if (uparam == param) {
      // is node type
      node = Node.createNode(param, item);
      if (node)
        self.add(node);
      else {
        console.log('not created node: ' + param);
      }
    } else {
      // is node param name
      if (Node.isValue(item)) self.setParam(param, item);
      else {
        console.log('no PARAM: ' + item);
      }
    }
  }
}

Node.detectNode = function(item) {
  var keys = _.keys(item);
  if (keys.length != 1 || keys[0].toUpperCase() !== keys[0]) return null;
  var key = keys[0];
  return {
    name: key,
    data: item[key]
  };
}

Node.isValue = function(data) {
  if (_.isPlainObject(data)) return false;

  if (_.isArray(data) && data.length > 0 && _.isPlainObject(data[0])) return false;

  return true;
}

Node.prototype.setParam = function(name, value) {
  this[name] = value;
}

Node.prototype.getNodesByType = function(type) {
  var nodes = [];
  if(this._nodes && this._nodes.length > 0){
    for (var i = 0; i < this._nodes.length; i++) {
      var node = this._nodes[i];
      if(node._type===type) nodes.push(node);
    };
  }
  return nodes;
}

var add = function(parent, node) {
  assert(node, 'Error while trying to add a non-existant node to a query');
  //this.nodes.push(typeof node === 'string' ? new TextNode(node) : node.toNode());
  if (!parent._nodes) parent._nodes = [];
  parent.onAddingNode(node);
  parent._nodes.push(node);
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

Node.prototype.onAddingNode = function(node){
  return true;
}

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