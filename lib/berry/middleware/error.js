/*jslint node:true, white:true, nomen:true */
'use strict';

var _ = require('underscore'),
    http = require('http'),
    DEF_STATUS = 500,
    DEF_ERROR_CODE = -9999,
    DEF_ERROR_MESSAGE = 'Unknown Error',
    DEF_ERROR_MESSAGES = require('../static/errors');

/**
 * 미들웨어에서 에러가 발생하면 적절한 에러 메시지 응답을 보냄.
 *
 * ```
 * app.use(berry.middleware.error({
 *    path: /api/,
 *    errorMessages: { '-3999':'Custom Error' }
 * });
 * ```
 * @param opts.path {RegExp}
 * @param opts.errorMessages {object<string,string>} 커스텀 에러 메시지 정의
 */
module.exports = function (opts) {
  var path = opts.path,
      errorMessages = _.defaults(opts.errorMessages||{}, DEF_ERROR_MESSAGES, http.STATUS_CODES);

  return function (err, req, res, next) {
    var status, code, message, result;

    if (path && !path.test(req.path)) {
        next(err);
        return;
    }

    if (_.isObject(err)) {
      status = err.status || DEF_STATUS;
      code = err.code || DEF_ERROR_CODE;
      message = err.message || errorMessages[code] || DEF_ERROR_MESSAGE;
    } else if (_.isNumber(err)) {
      status = DEF_STATUS,
      code = err;
      message = errorMessages[code] || DEF_ERROR_MESSAGE;
    } else {
      status = DEF_STATUS;
      code = DEF_ERROR_CODE;
      message = DEF_ERROR_MESSAGE;
    }

    // TODO: generate response by accept request header
    // ...

    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-BERRY-ERROR-CODE', code);
    res.setHeader('X-BERRY-ERROR-MESSAGE', message);
    res.end(JSON.stringify({
      error: {
        code: code,
        message: message
      }
    }));
    //next(err);
  };

};

