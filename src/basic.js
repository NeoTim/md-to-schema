'use strict';

const SimpleMarkdown = require('simple-markdown');
const yaml = require('js-yaml');
const mdParse = SimpleMarkdown.defaultBlockParse;

module.exports = str => {
  return getBasic(str);
};

function getBasic(basic) {
  const syntaxTree = mdParse(basic);
  const find = syntaxTree.find(
    item => item.type === 'codeBlock' && item.lang === 'yaml'
  );

  if (!find) return {};
  const obj = yaml.safeLoad(find.content);
  return obj;
}
