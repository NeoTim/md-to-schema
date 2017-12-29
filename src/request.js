'use strict';

const SimpleMarkdown = require('simple-markdown');
const { json } = require('object-to-schema');
const mdParse = SimpleMarkdown.defaultBlockParse;
const { parse } = require('json-comment-parser');

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
  const object = parse(find.content);
  return object;
}
