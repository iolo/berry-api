/*jslint node:true,white:true,nomen:true */
'use strict';

var DEF_ORIGIN = '*',
    DEF_METHODS = 'GET,POST,PUT,DELETE,HEAD';

/**
 * CORS 헤더를 응답에 추가하는 미들웨어.
 *
 * ```
 * app.use(berry.middleware.cors({
 *    path: /public/,
 *    origin: '*',
 *    methods: 'GET,POST,PUT,DELETE,HEAD',
 *    headers: 'X-CUSTOM-HEADER,X-ANOTHER-HEADER'
 * }); 
 * ```
 * @param opts.path {RegExp}
 * @param opts.origin {string}
 * @param opts.methods {string}
 * @param opts.headers {string}
 */
module.exports = function(opts) {
  var path = opts.path,
      origin = opts.origin || DEF_ORIGIN,
      methods = opts.methods || DEF_METHODS,
      headers = opts.headers;

  return function (req, res, next) {
    if (path && !path.test(req.path)) {
        next();
        return;
    }

    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', methods);
    // Access-Control-Allow-Headers must set when using custom header
    if (headers) {
      res.header('Access-Control-Allow-Headers', headers);
    }

    next();
  };
};

