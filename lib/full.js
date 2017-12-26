'use strict';

// TODO 都没校验

var toBasic = require('./basic');
var toRequest = require('./request');
var toResponses = require('./responses');

module.exports = function (str) {
  var _splitDocsStr = splitDocsStr(str),
      basic = _splitDocsStr.basic,
      request = _splitDocsStr.request,
      responses = _splitDocsStr.responses;

  basic = toBasic(basic);
  request = toRequest(request);
  responses = toResponses(responses);
  return {
    basic: basic,
    request: request,
    responses: responses
  };
};

// TODO 不够严格
function splitDocsStr(str) {
  var splitRequest = str.split('# Request');
  var splitResponses = splitRequest[1].split('# Responses');
  var basic = splitRequest[0];
  var request = splitResponses[0];
  var responses = splitResponses[1];
  return { basic: basic, request: request, responses: responses };
}