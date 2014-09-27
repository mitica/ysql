'use strict';

var _ = require('lodash');
var assert = require('assert');
var util = require('util');
var nutil = require('./util');

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
    this.setParam('value', data, true);
    return;
  }
  var self = this,
    node = null;

  if (_.isArray(data)) {
    data.forEach(function(item) {
      node = Node.detectNode(item);
      if (!node) {
        throw new Error('cannot detect a NODE in: ' + JSON.stringify(item));
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
        node = Node.detectNode(item);
        if (node) self.setParam(param, Node.createNode(node.name, node.data));
        else console.log('no PARAM: ' + JSON.stringify(item));
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

Node.prototype.setParam = function(name, value, isDefault) {
  if(isDefault === true && this._defaultValueParam) name = this._defaultValueParam;
  this[name] = value;
}

Node.prototype.getNodesByType = function(type) {
  var nodes = [];
  if (this._nodes && this._nodes.length > 0) {
    for (var i = 0; i < this._nodes.length; i++) {
      var node = this._nodes[i];
      if (node._type === type) nodes.push(node);
    };
  }
  return nodes;
}

Node.prototype.getNodeByType = function(type) {
  var nodes = this.getNodesByType(type);
  if (nodes.length > 0) return nodes[0];
  return null;
}

var add = function(parent, node) {
  assert(node, 'Error while trying to add a non-existant node to a query');
  //this.nodes.push(typeof node === 'string' ? new TextNode(node) : node.toNode());
  if (!parent._nodes) parent._nodes = [];
  if (parent.onAddingNode(node))
    parent._nodes.push(node);
  else throw new Error('YSQL error: cannot add node ' + node._type + ' in node ' + parent._type);
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

Node.prototype.onAddingNode = function(node) {
  if (this._maxNodes && this._maxNodes > -1 && this._nodes.length >= this._maxNodes) return false;
  if (this._validNodes && this._validNodes.indexOf(node._type) < 0) return false;
  if (this._invalidNodes && this._invalidNodes.indexOf(node._type) >= 0) return false;
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
  name = name.toUpperCase();
  var idx = nutil.SUPPORTED_NODES.indexOf(name);
  if (idx < 0) {
    _.forEach(nutil.NODES_ALIAS, function(arr, key) {
      if (arr.indexOf(name) > -1) {
        idx = nutil.SUPPORTED_NODES.indexOf(key);
        name = key;
        return false;
      }
    });
  }
  if (idx > -1) {
    name = name.toLowerCase();
    var n = new(require('./' + name))(data);
    //if (data !== undefined) n.init(data);
    return n;
  }
  throw new Error('invalid node type: ' + name);
};

module.exports = Node;