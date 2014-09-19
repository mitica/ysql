
var Node = require('./node');

var Query = function(data){
  var node = Node.detectNode(data);
  if(node) return Node.createNode(node.name, node.data);
  throw new Error('data is not in a valid YSQL format: ' + JSON.stringify(data));
}

module.exports = Query;