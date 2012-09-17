/*jslint node:true,white:true,nomen:true */
'use strict';

var fs = require('fs'),
    path = require('path'),
    util = require('date-utils'),
    date_utils = require('date-utils'),
    connect = require('connect'),
    DEF_LOGS_DIR = 'logs',
    DEF_ACCESS_LOG_FILE = 'access-TIMESTAMP.log',
    DEF_ERROR_LOG_FILE = 'error-TIMESTAMP.log',
    TIMESTAMP_PLACEHOLDER = 'TIMESTAMP';

/**
 * 접근 로그를 남기는 미들웨어.
 * ```
 * app.use(berry.middle.logger({logsDir:'logs'});
 * ```
 * @param opts.logsDir {string} 로그 디렉토리
 * @param opts.accessLog {boolean} 접근 로그 남길지 여부
 * @param opts.accessLogFileName {string} 접근 로그 파일 이름
 * @param opts.errorLog {boolean} 에러 로그 남길지 여부
 * @param opts.errorLogFileName {string} 에러 로그 파일 이름
 */
module.exports = function (opts) {
  var timestamp = Date.today().toYMD(),
      logsDir = path.resolve(opts.logsDir||DEF_LOGS_DIR),
      accessLogFileName = (opts.accessLogFile||DEF_ACCESS_LOG_FILE).replace(TIMESTAMP_PLACEHOLDER, timestamp),
      accessLogFile = path.resolve(logsDir, accessLogFileName),
      accessLogStream,
      errorLogFileName = (opts.errorLogFile||DEF_ERROR_LOG_FILE).replace(TIMESTAMP_PLACEHOLDER, timestamp),
      errorLogFile = path.resolve(logsDir, errorLogFileName),
      errorLogStream;

  if (opts.accessLog) {
    accessLogStream = fs.createWriteStream(accessLogFile, {flags:'a', encoding: 'utf8'});
  }

  if (opts.errorLog) {
    errorLogStream = fs.createWriteStream(errorLogFile, { flags: 'a+', encoding: 'utf8' });
    process.stdout.write = function(data, encoding, fd) {
      errorLogStream.write(data, encoding, fd);
    };
    process.stderr.write = function(data, encoding, fd) {
      errorLogStream.write(data, encoding, fd);
    };
  }

  process.on('exit', function() {
    if (accessLogStream) { accessLogStream.end(); }
    if (errorLogStream) { errorLogStream.end(); }
  });

  return connect.logger({stream:(accessLogStream||process.stdout)});
};

