'use strict';

const SimpleMarkdown = require('simple-markdown');
const { json } = require('object-to-schema');
const yaml = require('js-yaml');
const mdParse = SimpleMarkdown.defaultBlockParse;

module.exports = str => {
  let { basic, request, responses } = splitDocsStr(str);
  basic = getBasic(basic);
  request = getRequest(request);
  responses = getResponses(responses);
  request = requestToSchema(request);
  responses = responsesToSchema(responses);
  return {
    basic,
    request,
    responses,
  };
};

function requestToSchema(request) {
  const { query = {}, headers = {}, body = {} } = request;
  return {
    query: json(query),
    headers: json(headers),
    body: json(body),
  };
}

function responsesToSchema(responses) {
  return responses.map(item => {
    const { body = {} } = item;
    item.body = json(body);
    return item;
  });
}

function splitDocsStr(str) {
  const splitRequest = str.split('# Request');
  const splitResponses = splitRequest[1].split('# Responses');
  const basic = splitRequest[0];
  const request = splitResponses[0];
  const response = splitResponses[1];
  const responses = [];
  const arr = response.split('##');
  arr.forEach(item => {
    const reg = /Scene/;
    if (reg.test(item)) {
      responses.push(item);
    }
  });
  return { basic, request, responses };
}

function getBasic(basic) {
  const syntaxTree = mdParse(basic);
  const find = syntaxTree.find(
    item => item.type === 'codeBlock' && item.lang === 'yaml'
  );

  if (!find) return {};
  const obj = yaml.safeLoad(find.content);
  return obj;
}

function getRequest(request) {
  const syntaxTree = mdParse(request);
  const find = syntaxTree.find(
    item => item.type === 'codeBlock' && item.lang === 'js'
  );

  if (!find) return;
  /* eslint-disable no-new-func */
  const obj = new Function(`return ${find.content}`)();
  return obj;
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
    /* eslint-disable no-new-func */
    const obj = new Function(`return ${js.content}`)();
    result.push({
      body: obj,
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
