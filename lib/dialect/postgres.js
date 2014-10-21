'use strict';

var _ = require('lodash');

var Postgres = function(config) {
  this.params = [];
}

Postgres.prototype._quoteCharacter = '"';
Postgres.prototype.quote = function(word, quoteCharacter) {
  var q;
  if (quoteCharacter) {
    // use the specified quote character if given
    q = quoteCharacter;
  } else {
    q = this._quoteCharacter;
  }

  return q + word.replace(new RegExp(q, 'g'), q + q) + q;
};

Postgres.prototype._getParameterPlaceholder = function(index, name) {
  return [undefined, null, ''].indexOf(name) == -1 ? ':' + name : '?';
};

Postgres.prototype.visit = function(node, parent) {
  if (!(node && node.toNode)) {
    console.log('invalid node on visit: ' + node);
    return [];
  }
  //console.log(JSON.stringify(node));
  switch (node._type) {
    //case 'QUERY':
    //  return this.visitQuery(node, parent);
    //case 'SUBQUERY'        : return this.visitSubquery(node);
    case 'SELECT':
      return this.visitSelect(node, parent);
      //case 'INSERT'          : return this.visitInsert(node);
      //case 'UPDATE'          : return this.visitUpdate(node);
      //case 'DELETE'          : return this.visitDelete(node);
      //case 'CREATE'          : return this.visitCreate(node);
      //case 'DROP'            : return this.visitDrop(node);
      //case 'AS':
      //  return this.visitAs(node, parent);
      //case 'ALTER'           : return this.visitAlter(node);
      //case 'CAST'            : return this.visitCast(node);
    case 'FROM':
      return this.visitFrom(node, parent);
    case 'WHERE':
      return this.visitWhere(node, parent);
    case 'ORDER':
      return this.visitOrderBy(node);
    case 'OPERATOR':
      return this.visitOperator(node);
      //case 'ORDER BY VALUE'  : return this.visitOrderByValue(node);
    case 'GROUP':
      return this.visitGroupBy(node);
    case 'HAVING':
      return this.visitHaving(node);
      //case 'RETURNING'       : return this.visitReturning(node);
      //case 'FOR UPDATE'      : return this.visitForUpdate();
      //case 'FOR SHARE'       : return this.visitForShare();
    case 'TABLE':
      return this.visitTable(node, parent);
    case 'COLUMN':
      return this.visitColumn(node, parent);
    case 'COLUMNS':
      return this.visitColumns(node, parent);
    case 'CONDITION':
      return this.visitCondition(node, parent);
    case 'EXPRESSION':
      return this.visitExpression(node, parent);
    case 'FUNC':
      return this.visitFunction(node, parent);
    case 'JOIN':
      return this.visitJoin(node);
    case 'ON':
      return this.visitOn(node);
      //case 'LITERAL'         : return this.visitLiteral(node);
      //case 'TEXT'            : return node.text;
      //case 'PARAMETER'       : return this.visitParameter(node);
      //case 'DEFAULT'         : return this.visitDefault(node);
      //case 'IF EXISTS'       : return this.visitIfExists();
      //case 'IF NOT EXISTS'   : return this.visitIfNotExists();
      //case 'CASCADE'         : return this.visitCascade();
      //case 'RESTRICT'        : return this.visitRestrict();
      //case 'RENAME'          : return this.visitRename(node);
      //case 'ADD COLUMN'      : return this.visitAddColumn(node);
      //case 'DROP COLUMN'     : return this.visitDropColumn(node);
      //case 'RENAME COLUMN'   : return this.visitRenameColumn(node);
      //case 'INDEXES'         : return this.visitIndexes(node);
      //case 'CREATE INDEX'    : return this.visitCreateIndex(node);
      //case 'DROP INDEX'      : return this.visitDropIndex(node);
      //case 'FUNCTION CALL'   : return this.visitFunctionCall(node);
      //case 'ARRAY CALL'      : return this.visitArrayCall(node);

      //case 'POSTFIX UNARY' : return this.visitPostfixUnary(node);
      //case 'PREFIX UNARY'  : return this.visitPrefixUnary(node);
      //case 'BINARY'        : return this.visitBinary(node);
      //case 'TERNARY'       : return this.visitTernary(node);
      //case 'IN'            : return this.visitIn(node);
      //case 'NOT IN'        : return this.visitNotIn(node);
      //case 'CASE'          : return this.visitCase(node);
      //case 'AT'            : return this.visitAt(node);
      //case 'SLICE'         : return this.visitSlice(node);
    case 'DISTINCT':
      return this.visitDistinct(node, parent);
    case 'LIMIT':
      return this.visitLimit(node, parent);
    case 'PARAM':
      return this.visitParam(node, parent);
    case 'PARAMS':
      return this.visitParams(node, parent);
    case 'OFFSET':
      return this.visitOffset(node, parent);
    case 'VALUE':
      return this.visitValue(node, parent);
    default:
      throw new Error("Unrecognized node type " + node._type);
  }
};

Postgres.prototype.visitQuery = function(node, parent) {
  var result = [];
  var self = this;
  node._nodes.forEach(function(item) {
    result.push(self.visit(item).join(' '));
  });
  result = result.join(' ');
  //console.log('query:');
  //console.log(result);
  //console.log('=======')
  if (parent && parent.toNode) {
    result = '(' + result + ')';
  }
  if (node.as)
    result += this.visitAs(node.as);
  //this._selectOrDeleteEndIndex = this.output.length + result.length;
  return [result];
};

Postgres.prototype.visitSelect = function(node, parent) {
  var result = ['SELECT'];
  if (node.distinct === true) {
    result.push('DISTINCT');
  }

  result.push(node._nodes.map(this.visit.bind(this)).join(' '));

  if (parent && parent.toNode) {
    result[0] = '(' + result[0];
    result[result.length - 1] += ')';
  }
  if (node.as)
    result.push(this.visitAs(node.as));

  return [result.join(' ')];
};

Postgres.prototype.visitFrom = function(target) {
  var result = ['FROM'].concat(target._nodes.map(this.visit.bind(this)));
  return [result.join(' ')];
};

Postgres.prototype.visitJoin = function(target) {
  var result = [target.name, 'JOIN'].concat(target._nodes.map(this.visit.bind(this)));
  return [result.join(' ')];
};

Postgres.prototype.visitOn = function(target) {
  var result = ['ON'].concat(target._nodes.map(this.visit.bind(this)));
  return [result.join(' ')];
};

Postgres.prototype.visitColumn = function(node, parent) {
  var name = node.name;
  var self = this;
  if (node.table) name = node.table + '.' + name;
  if (name) {
    name = name.split('.');
    name.forEach(function(n, i, arr) {
      arr[i] = self.quote(n)
    });
    name = name.join('.');
    name += this.visitAs(node.as);
  }
  var result = [name];
  //result = result.concat(this.visitAs(node.as));
  //this._selectOrDeleteEndIndex = this.output.length + result.length;
  return result;
};

Postgres.prototype.visitColumns = function(node, parent) {
  var result = [node._nodes.map(this.visit.bind(this)).join(', ')];
  //this._selectOrDeleteEndIndex = this.output.length + result.length;
  return result;
};

Postgres.prototype.visitAs = function(as) {
  if (!as) return '';
  var result = ' AS ' + this.quote(as);
  return result;
};

Postgres.prototype.visitTable = function(node, parent) {
  var result = [this.quote(node.name)];
  if (node.as)
    result[0] += this.visitAs(node.as);
  return result;
};

Postgres.prototype.visitLimit = function(node, parent) {
  var result = ['LIMIT'];
  if (node._nodes && node._nodes.length == 1)
    result.push(this.visit(node._nodes[0]).join(' '));
  else result.push(node.value);
  return [result.join(' ')];
};

Postgres.prototype.visitOffset = function(node, parent) {
  return ['OFFSET ' + node.value];
};
Postgres.prototype.visitOperator = function(node, parent) {
  var result = [node.value];
  //this._selectOrDeleteEndIndex = this.output.length + result.length;
  return result;
};

Postgres.prototype.visitDistinct = function(node, parent) {
  return ['DISTINCT'];
};

Postgres.prototype.visitOrderBy = function(orderBy) {
  var result = ['ORDER BY'];
  var list = [];
  var self = this;
  orderBy._nodes.forEach(function(item) {
    var it = self.visit(item, orderBy).join('');
    if (_.isString(item.direction)) {
      var d = item.direction.toUpperCase().trim();
      if (d === 'ASC' || d === 'DESC') it += ' ' + d;
    }
    list.push(it);
  });
  result.push(list.join(', '));
  return [result.join(' ')];
};

Postgres.prototype.visitGroupBy = function(groupBy) {
  var result = ['GROUP BY', groupBy._nodes.map(this.visit.bind(this)).join(', ')];
  return [result.join(' ')];
};

Postgres.prototype.visitHaving = function(having) {
  var result = ['HAVING', having._nodes.map(this.visit.bind(this)).join(' AND ')];
  return result;
};

Postgres.prototype.visitWhere = function(where) {
  var result = ['WHERE', where._nodes.map(this.visit.bind(this)).join(' ')];
  return [result.join(' ')];
};

Postgres.prototype.visitCondition = function(node) {
  var result = [this.visit(node._nodes[0], node).join('')];
  if (node.relation)
    result.push(node.relation);
  return [result.join(' ')];
};

Postgres.prototype.visitExpression = function(node) {
  //console.log(JSON.stringify(node));
  var result = ['('];
  result.push(node._nodes.map(this.visit.bind(this)).join(' '));
  result.push(')');
  return [result.join('')];
};

Postgres.prototype.visitParam = function(node) {
  var pi = -1;
  if (_.isString(node.name)) {
    pi = _.findIndex(this.params, {
      name: node.name
    });
  }
  if (pi < 0) {
    this.params.push({
      name: node.name
    });
    pi = this.params.length - 1;
  }

  var result = [this._getParameterPlaceholder(pi + 1, node.name)];
  return result;
};

Postgres.prototype.visitParams = function(node) {
  var result = [node._nodes.map(this.visit.bind(this)).join(', ')];
  return result;
};

Postgres.prototype.visitValue = function(value) {
  if (value.value === undefined || value.value === null) return [];
  var result = ["'" + value.value.toString() + "'"];
  return result;
};

Postgres.prototype.visitFunction = function(node) {
  var name = node.name;
  var result = name + '(' + this.visit(node._nodes[0], node).join(', ') + ')';
  if (node.as)
    result += ' AS ' + node.as;
  return [result];
};


Postgres.prototype.toSql = function(node) {
  var text = this.visit(node).join(' ').trim();
  return {
    text: text,
    params: this.params
  };
}


module.exports = Postgres;
