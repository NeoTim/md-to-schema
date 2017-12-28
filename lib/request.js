'use strict';

var SimpleMarkdown = require('simple-markdown');

var _require = require('object-to-schema'),
    json = _require.json;

var mdParse = SimpleMarkdown.defaultBlockParse;
var parser = require('json-parser');
var toQuotesObject = require('./to-quotes-object');

module.exports = function (str) {
  var request = getRequest(str);
  return requestToSchema(request);
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

function getRequest(request) {
  var syntaxTree = mdParse(request);
  var find = syntaxTree.find(function (item) {
    return item.type === 'codeBlock' && item.lang === 'js';
  });

  if (!find) return;
  var quotesObject = toQuotesObject(find.content);
  var object = parser.parse(quotesObject);
  return object;
}