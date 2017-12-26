'use strict';

// TODO 都没校验
const toBasic = require('./basic');
const toRequest = require('./request');
const toResponses = require('./responses');

module.exports = str => {
  let { basic, request, responses } = splitDocsStr(str);
  basic = toBasic(basic);
  request = toRequest(request);
  responses = toResponses(responses);
  return {
    basic,
    request,
    responses,
  };
};

// TODO 不够严格
function splitDocsStr(str) {
  const splitRequest = str.split('# Request');
  const splitResponses = splitRequest[1].split('# Responses');
  const basic = splitRequest[0];
  const request = splitResponses[0];
  const responses = splitResponses[1];
  return { basic, request, responses };
}
