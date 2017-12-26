'use strict';

var SimpleMarkdown = require('simple-markdown');
var yaml = require('js-yaml');
var mdParse = SimpleMarkdown.defaultBlockParse;

module.exports = function (str) {
  return getBasic(str);
};

function getBasic(basic) {
  var syntaxTree = mdParse(basic);
  var find = syntaxTree.find(function (item) {
    return item.type === 'codeBlock' && item.lang === 'yaml';
  });

  if (!find) return {};
  var obj = yaml.safeLoad(find.content);
  return obj;
}