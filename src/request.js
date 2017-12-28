'use strict';

const SimpleMarkdown = require('simple-markdown');
const { json } = require('object-to-schema');
const mdParse = SimpleMarkdown.defaultBlockParse;
const parser = require('json-parser');
const toQuotesObject = require('./to-quotes-object');

module.exports = str => {
  const request = getRequest(str);
  return requestToSchema(request);
};

function requestToSchema(request) {
  const { query = {}, headers = {}, body = {} } = request;
  return {
    query: json(query),
    headers: json(headers),
    body: json(body),
  };
}

function getRequest(request) {
  const syntaxTree = mdParse(request);
  const find = syntaxTree.find(
    item => item.type === 'codeBlock' && item.lang === 'js'
  );

  if (!find) return;
  const quotesObject = toQuotesObject(find.content);
  const object = parser.parse(quotesObject);
  return object;
}
