'use strict';

var acorn = require('acorn');
var estraverse = require('estraverse');

module.exports = function (source) {
  var nodes = [];
  var ast = acorn.parse('(' + source + ')', {
    ranges: true
  });
  estraverse.replace(ast, {
    enter: function enter(node) {
      if (node.type === 'Identifier') {
        nodes.push(node);
      }
    }
  });

  nodes.reverse().forEach(function (node) {
    var start = node.start,
        end = node.end;

    source = source.slice(0, start - 1) + ('"' + node.name + '"') + source.slice(end - 1);
  });

  return source;
};