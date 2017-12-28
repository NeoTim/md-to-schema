'use strict';

const acorn = require('acorn');
const estraverse = require('estraverse');

module.exports = source => {
  const nodes = [];
  const ast = acorn.parse(`(${source})`, {
    ranges: true,
  });
  estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'Identifier') {
        nodes.push(node);
      }
    },
  });

  nodes.reverse().forEach(node => {
    const { start, end } = node;
    source =
      source.slice(0, start - 1) + `"${node.name}"` + source.slice(end - 1);
  });

  return source;
};
