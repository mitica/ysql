
var SUPPORTED_NODES = [
  //'AS',
  'COLUMN', 'COLUMNS', 'CONDITION',
  'GROUP',
  'DISTINCT',
  'EXPRESSION',
  'FROM', 'FUNC',
  'ORDER', 'OFFSET', 'OPERATOR',
  'HAVING',
  'LIMIT',
  'PARAM', 'PARAMS',
  'SELECT',
  'TABLE',
  'VALUE',
  'WHERE',
  'ON',
  'JOIN'
];

var NODES_ALIAS = {
  GROUP: ['GROUPBY', 'GROUP_BY', 'GROUP BY'],
  ORDER: ['ORDERBY', 'ORDER_BY', 'ORDER BY'],
  FUNC: ['FUNCTION']
};

var v = {
  SUPPORTED_NODES: SUPPORTED_NODES,
  NODES_ALIAS: NODES_ALIAS
};

SUPPORTED_NODES.forEach(function(name){
v[name] = name;
});

module.exports = v;