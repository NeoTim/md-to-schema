'use strict';

const SimpleMarkdown = require('simple-markdown');
const { json } = require('object-to-schema');
const yaml = require('js-yaml');
const mdParse = SimpleMarkdown.defaultBlockParse;
const parser = require('json-parser');
const toQuotesObject = require('./to-quotes-object');

module.exports = str => {
  const responses = [];
  const arr = str.split('##');
  arr.forEach(item => {
    const reg = /Scene/;
    if (reg.test(item)) {
      responses.push(item);
    }
  });
  const responsesObj = getResponses(responses);
  return responsesToSchema(responsesObj);
};

function responsesToSchema(responses) {
  return responses.map(item => {
    const { body = {} } = item;
    item.body = json(body);
    return item;
  });
}

function getResponses(responses) {
  const result = [];
  responses.forEach(item => {
    const syntaxTree = mdParse(item);

    const js = syntaxTree.find(
      item => item.type === 'codeBlock' && item.lang === 'js'
    );

    const yml = syntaxTree.find(
      item => item.type === 'codeBlock' && item.lang === 'yaml'
    );

    const ymlObj = yaml.safeLoad(yml.content);

    if (!js) return {};
    const quotesObject = toQuotesObject(js.content);
    const body = parser.parse(quotesObject);

    result.push({
      body,
      mock: {
        delay: ymlObj.delay,
        enable: ymlObj.mock,
      },
      scene: {},
      description: ymlObj.desc,
    });
  });
  return result;
}
