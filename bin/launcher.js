/*jslint node:true,white:true,nomen:true */
'use strict';

var cluster = require('cluster'),
    pid = process.pid,
    numWorkers = 1; //require('os').cpus().length;

if (cluster.isMaster) {
  var i, worker;

  console.info("\
     ______                       o  o   \n\
    / ____ |                     o  o  o \n\
   / /___/ /  __   __,__  __,__   __  __ \n\
  / ____ <  / o_| / ____|/ ____| / / / / \n\
 / /___/ / / <_  / /    / /     | |_/ /  \n\
/_______/ |___/ /_/    /_/     _|__  /   \n\
                              /_____/    \n\
");
  console.info('berry-api master started: pid=' + pid);

  process.on('exit', function (code) {
    console.log('berry-api master exit: pid=' + pid + ', code=' + code);
  });
  process.on('uncaughtException', function (err) {
    console.log('berry-api master error: pid=' + pid + ', err=' + err);
  });
  process.on('SIGINT', function() {
    console.info('berry-api master killed: pid=' + pid);
  });

  for (i = 0; i < numWorkers; i += 1) {
    worker = cluster.fork();
    console.log('berry-api worker started: id=' + worker.id + ', pid=' + worker.process.pid);
  }

  cluster.on('exit', function (worker, code, signal) {
    console.error('berry-api worker died: id=' + worker.id + ', pid=' + worker.process.pid + ', code=' + code + ', signal=' + signal);
  });
} else {
  require('../lib/main').main(cluster.worker);
}
