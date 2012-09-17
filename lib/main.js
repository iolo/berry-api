/*jslint node:true,white:true,nomen:true */
'use strict';

var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    util = require('util'),
    date_utils = require('date-utils'),
    http = require('http'),
    connect = require('connect');

// 'berry' 하위 모듈을 자바 패키지 스타일로 전역 변수로 노출
require('packagestyle').imports('./lib/berry', GLOBAL);

/**
 *
 * @param worker {Worker} node-cluster모듈의 worker 객체. 생략하면 클러스터 없이 단독 실행.
 */
function main(worker) {
  var workerId = (worker) ? worker.id : -1,
      workerPid = (worker) ? worker.process.pid : process.pid,
      app = connect(),
      server = http.createServer(app),
      config = berry.config,
      API_PATH = /^\/api\/v1\//;

  console.log('***berry-api config***');
  console.log(config);

  app.use(berry.middleware.logger(config.logger));

  //app.use(berry.middleware.error({path:API_PATH}));

  //app.use(berry.middleware.cors({path:API_PATH, origin:'*', method:'GET,POST,PUT,DELETE,HEAD', headers:'X-BERRY-TOKEN'}));

  app.use(berry.middleware.auth({path:API_PATH, scheme:'Basic', realm:'Berry API Service', users: config.apiUsers}));

  app.use(berry.middleware.parser(config.parser));

  // install berry api handlers
  //berry.apis.boot(app);
  app.use('/api/v1/hello', function (req, res, next) {
    res.end('world');
  });
  app.use('/api/v1/add', function (req, res, next) {
    var a = parseInt(req.query.a, 10),
        b = parseInt(req.query.b, 10);
    if (_.isNaN(a) || _.isNaN(b)) {
      console.log('add errorr311');
      throw {status:311, message:'add error311', code:-2000};
    }
    console.log('add result=', r);
    res.end(JSON.stringify(r));
  });

  app.use(connect.static(path.resolve('public')));
  app.use(connect.directory(path.resolve('public')));

  app.use(connect.favicon());

  switch (config.env) {
    case 'development':
      app.use(connect.errorHandler({ dumpExceptions: true, showStack: true }));
      break;
    default:
      app.use(connect.errorHandler({ dumpExceptions: false, showStack: false }));
      break;
  }

  /*
  require('socket.io').listen(server).sockets.on('connection', function (socket) {
    var file = path.resolve('logs/access-' + Date.today().toYMD() + '.log'),
        tailProc = require('child_process').spawn('tail', ['-f', file]);
    tailProc.stdout.on('data', function (data) {
      socket.emit('log', data.toString('utf8'));
    });
  });
  */

  // OK! here we go!
  server.listen(config.http.port, config.http.host);

  console.log('***berry-api started***');
  console.log('\tenv=' + config.env);
  console.log('\tversion=' + config.version);
  console.log('\thost=' + config.http.host);
  console.log('\tport=' + config.http.port);
  console.log('\tworker=' + workerId);
  console.log('\tpid=' + workerPid);
};

// lib/noremong.js를 직접으로 실행하면 클러스터 없이 실행
if (require.main == module) {
  main();
}

exports.main = main;

