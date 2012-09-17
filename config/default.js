/*jslint node:true,white:true,nomen:true */
'use strict';

var path = require('path'),
    basedir = path.resolve(process.env.BERRY_HOME)||process.cwd();

module.exports = {
  basedir: basedir,
  tmpDir: path.resolve(basedir, 'tmp'),
  http: {
    host: '0.0.0.0',
    port: 8080
  },
  logger: {
    logsDir: path.resolve(basedir, 'logs'),
    accessLog: true,
    accessLogFileName: 'access-TIMESTAMP.log',
    errorLog: false,
    errorLogFileName: 'error-TIMESTAMP.log',
  },
  parser: {
    uploadDir: 'tmp/uploads',
    keepExtension: true,
    maxFieldsSize: 10*1024*1024,
  },
  apiUsers: {
    '11111111': { secret:'11111111', env:/ios/ },
    '22222222': { secret:'22222222', env:/and/ },
    '33333333': { secret:'33333333', env:/web/ },
    '44444444': { secret:'44444444', env:/.*/ }
  },
  mongo: {
    host: 'berry02.iolo.kr',
    port: 27017,
    db: 'berry_dev'
  },
  redis: {
    host: 'berry01.iolo.kr',
    port: 6379,
    skip: false
  },
  berrysvc: {
    host: 'berry03.iolo.kr',
    port: 9000
  },
  version: '0.0.1'
};
