'use strict';

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

Postgres.prototype._getParameterPlaceholder = function(index, value) {
  /* jshint unused: false */
  return '$' + index;
};

Postgres.prototype.visit = function(node, parent) {
  switch (node._type) {
    case 'QUERY':
      return this.visitQuery(node, parent);
      //case 'SUBQUERY'        : return this.visitSubquery(node);
    case 'SELECT':
      return this.visitSelect(node);
      //case 'INSERT'          : return this.visitInsert(node);
      //case 'UPDATE'          : return this.visitUpdate(node);
      //case 'DELETE'          : return this.visitDelete(node);
      //case 'CREATE'          : return this.visitCreate(node);
      //case 'DROP'            : return this.visitDrop(node);
    case 'AS':
      return this.visitAs(node);
      //case 'ALTER'           : return this.visitAlter(node);
      //case 'CAST'            : return this.visitCast(node);
    case 'FROM':
      return this.visitFrom(node);
    case 'WHERE':
      return this.visitWhere(node);
      //case 'ORDER BY'        : return this.visitOrderBy(node);
      //case 'ORDER BY VALUE'  : return this.visitOrderByValue(node);
      //case 'GROUP_BY'        : return this.visitGroupBy(node);
      //case 'HAVING'          : return this.visitHaving(node);
      //case 'RETURNING'       : return this.visitReturning(node);
      //case 'FOR UPDATE'      : return this.visitForUpdate();
      //case 'FOR SHARE'       : return this.visitForShare();
    case 'TABLE':
      return this.visitTable(node);
    case 'COLUMN':
      return this.visitColumn(node);
    case 'COLUMNS':
      return this.visitColumns(node);
    case 'JOIN':
      return this.visitJoin(node);
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
      return this.visitDistinct(node);
    case 'LIMIT':
      return this.visitLimit(node);
    case 'OFFSET':
      return this.visitOffset(node);
    default:
      throw new Error("Unrecognized node type " + node._type);
  }
};

Postgres.prototype.visitQuery = function(node, parent) {
  var result = [node._nodes.map(this.visit.bind(this)).join(' ')];
  //console.log('query:');
  //console.log(result);
  //console.log('=======')
  if (parent && parent.toNode) {
    result[0] = '(' + result[0] + ')';
  }
  if (node.as)
    result[0] += this.visitAs(node.as);
  //this._selectOrDeleteEndIndex = this.output.length + result.length;
  return result;
};

Postgres.prototype.visitSelect = function(node) {
  var result = ['SELECT ' + node._nodes.map(this.visit.bind(this)).join(' ')];
  return result;
};

Postgres.prototype.visitFrom = function(from) {
  var result = ['FROM '];
  var list = [];

  for (var i = 0; i < from._nodes.length; i++) {
    list = list.concat(this.visit(from._nodes[i], from));
  }

  result[0] += list.join(', ');
  return result;
};

Postgres.prototype.visitColumn = function(node, parent) {
  var name = node.name;
  if (node.table) name = node.table + '.' + name;
  name += this.visitAs(node.as);
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
    result[0]+=this.visitAs(node.as);
  return result;
};

Postgres.prototype.visitLimit = function(node, parent) {
  return ['LIMIT ' + node.value];
};

Postgres.prototype.visitOffset = function(node, parent) {
  return ['OFFSET ' + node.value];
};

Postgres.prototype.visitDistinct = function(node, parent) {
  return ['DISTINCT'];
};

Postgres.prototype.visitOrderBy = function(orderBy) {
  var result = ['ORDER BY', orderBy._nodes.map(this.visit.bind(this)).join(', ')];
  return result;
};

Postgres.prototype.visitGroupBy = function(groupBy) {
  var result = ['GROUP BY', groupBy._nodes.map(this.visit.bind(this)).join(', ')];
  return result;
};

Postgres.prototype.visitHaving = function(having) {
  var result = ['HAVING', having._nodes.map(this.visit.bind(this)).join(' AND ')];
  return result;
};

Postgres.prototype.visitWhere = function(where) {
  var result = ['WHERE', where._nodes.map(this.visit.bind(this)).join(', ')];
  return result;
};


Postgres.prototype.toSql = function(node) {
  var text = this.visit(node).join(' ').trim();
  return {
    json: JSON.stringify(node),
    text: text,
    values: this.params
  };
}


module.exports = Postgres;