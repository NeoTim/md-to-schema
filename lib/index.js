'use strict';

var SimpleMarkdown = require('simple-markdown');

var _require = require('object-to-schema'),
    json = _require.json;

var yaml = require('js-yaml');
var mdParse = SimpleMarkdown.defaultBlockParse;

module.exports = function (str) {
  var _splitDocsStr = splitDocsStr(str),
      basic = _splitDocsStr.basic,
      request = _splitDocsStr.request,
      responses = _splitDocsStr.responses;

  basic = getBasic(basic);
  request = getRequest(request);
  responses = getResponses(responses);
  request = requestToSchema(request);
  responses = responsesToSchema(responses);
  return {
    basic: basic,
    request: request,
    responses: responses
  };
};

function requestToSchema(request) {
  var _request$query = request.query,
      query = _request$query === undefined ? {} : _request$query,
      _request$headers = request.headers,
      headers = _request$headers === undefined ? {} : _request$headers,
      _request$body = request.body,
      body = _request$body === undefined ? {} : _request$body;

  return {
    query: json(query),
    headers: json(headers),
    body: json(body)
  };
}

function responsesToSchema(responses) {
  return responses.map(function (item) {
    var _item$body = item.body,
        body = _item$body === undefined ? {} : _item$body;

    item.body = json(body);
    return item;
  });
}

function splitDocsStr(str) {
  var splitRequest = str.split('# Request');
  var splitResponses = splitRequest[1].split('# Responses');
  var basic = splitRequest[0];
  var request = splitResponses[0];
  var response = splitResponses[1];
  var responses = [];
  var arr = response.split('##');
  arr.forEach(function (item) {
    var reg = /Scene/;
    if (reg.test(item)) {
      responses.push(item);
    }
  });
  return { basic: basic, request: request, responses: responses };
}

function getBasic(basic) {
  var syntaxTree = mdParse(basic);
  var find = syntaxTree.find(function (item) {
    return item.type === 'codeBlock' && item.lang === 'yaml';
  });

  if (!find) return {};
  var obj = yaml.safeLoad(find.content);
  return obj;
}

function getRequest(request) {
  var syntaxTree = mdParse(request);
  var find = syntaxTree.find(function (item) {
    return item.type === 'codeBlock' && item.lang === 'js';
  });

  if (!find) return;
  /* eslint-disable no-new-func */
  var obj = new Function('return ' + find.content)();
  return obj;
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