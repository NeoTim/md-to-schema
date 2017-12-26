'use strict';

var SimpleMarkdown = require('simple-markdown');

var _require = require('object-to-schema'),
    json = _require.json;

var yaml = require('js-yaml');
var mdParse = SimpleMarkdown.defaultBlockParse;

module.exports = function (str) {
  var responses = [];
  var arr = str.split('##');
  arr.forEach(function (item) {
    var reg = /Scene/;
    if (reg.test(item)) {
      responses.push(item);
    }
  });
  var responsesObj = getResponses(responses);
  return responsesToSchema(responsesObj);
};

function responsesToSchema(responses) {
  return responses.map(function (item) {
    var _item$body = item.body,
        body = _item$body === undefined ? {} : _item$body;

    item.body = json(body);
    return item;
  });
}

function getResponses(responses) {
  var result = [];
  responses.forEach(function (item) {
    var syntaxTree = mdParse(item);

    var js = syntaxTree.find(function (item) {
      return item.type === 'codeBlock' && item.lang === 'js';
    });

    var yml = syntaxTree.find(function (item) {
      return item.type === 'codeBlock' && item.lang === 'yaml';
    });

    var ymlObj = yaml.safeLoad(yml.content);

    if (!js) return {};
    /* eslint-disable no-new-func */
    var obj = new Function('return ' + js.content)();
    result.push({
      body: obj,
      mock: {
        delay: ymlObj.delay,
        enable: ymlObj.mock
      },
      scene: {},
      description: ymlObj.desc
    });
  });
  return result;
}