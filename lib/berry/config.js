/*jslint node:true,white:true,nomen:true */
'use strict';

var _ = require('underscore'),
    DEF_ENV = 'development',
    env = process.env.NODE_ENV||DEF_ENV,
    DEF_CONFIG_PATH = (process.env.BERRY_HOME||'../../') + 'config/',
    DEF_CONFIG_FILE = DEF_CONFIG_PATH + 'default',
    defConfig = require(DEF_CONFIG_FILE),
    envConfig = require(DEF_CONFIG_PATH + env),
    config = _.defaults(envConfig, defConfig);

/**
 * `config` 디렉토리에서 현재 실행 환경(`NODE_ENV` 환경 변수)에 맞는 설정을 읽음.
 * `config/deafult.js`의 설정을 기본으로, 실행 환경에 따라 설정을 덮어쓸 수 있음.
 */
module.exports = config;

