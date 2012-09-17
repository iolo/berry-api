/*jslint node:true,white:true,nomen:true */
'use strict';

var fs = require('fs'),
    path = require('path'),
    connect = require('connect');

/**
 * 파일 업로드 처리를 포함한 본문을 파싱하는 미들웨어.
 *
 * ```
 * app.use(berry.middle.parser({uploadDir:'tmp'});
 * ```
 * @param opts.uploadDir {string} 업로드 디렉토리
 */
module.exports = function (opts) {
  var _urlencoded = connect.urlencoded(opts),
      _multipart = connect.multipart(opts),
      _json = connect.json(opts),
      _query = connect.query(opts);
    
  return function (req, res, next) {
    _query(req, res, function (err) {
      if (err) { return next(err); }
      _json(req, res, function (err) {
        if (err) { return next(err); }
        _urlencoded(req, res, function (err) {
          if (err) { return next(err); }
          _multipart(req, res, next);
        });
      });
    });
  };
};
