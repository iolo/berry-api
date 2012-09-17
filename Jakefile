var JSLINT='./node_modules/.bin/jslint';
var JSLINT_OPTS = '--color --passfail --node --white --nomen --vars --predef=GLOBAL --predef=imin';

var MOCHA='./node_modules/.bin/mocha';
var MOCHA_OPTS = '--colors --ignore-leaks -t 10s';
var MOCHA_TEST_ALL_OPTS = '-R doc > docs/test-all.html';
var MOCHA_TEST_COVERAGE_OPTS = '-R html-cov > docs/test-coverage.html';

var JSCOVERAGE='./node_modules/visionmedia-jscoverage/jscoverage';
var JSCOVERAGE_OPTS='--encoding=utf8';
var JSCOVERAGE_OUT_DIR='lib-jscoverage';

var THRIFT='/usr/local/bin/thrift';
var THRIFT_OPTS='--gen js:node';
var THRIFT_ALL_OPTS='-r -v';

var ASYNC = {async:true};
var EXEC_OPTS = jake.program.opts.quiet ? {} : {printStdout:true,printStderr:true,breakOnError:false};

namespace('jslint', function () {
  desc('jslint a js file');
  task('jslint', function (file, opts) {
    var jslintCmd = [JSLINT, JSLINT_OPTS, opts||'', file].join(' ');
    jake.exec(jslintCmd, function() {
      complete();
    }, EXEC_OPTS);
  }, ASYNC);

  desc('jslint all js files');
  task('all', function () {
    var fileList = new jake.FileList();
    fileList.include('lib/*.js');
    fileList.include('lib/**/*.js');
    jake.Task['jslint:jslint'].invoke(fileList.join(' '));
  });
});

namespace('test', function () {
  desc('test a mocha test-case');
  task('test', function (file, opts) {
    var mochaCmd = [MOCHA, MOCHA_OPTS, (opts||''), file].join(' ');
    jake.exec(mochaCmd, function () {
      complete();
    }, EXEC_OPTS);
  }, ASYNC);

  desc('test all mocha test-cases');
  task('all', function (opts) {
    var fileList = new jake.FileList();
    fileList.include('test/*test.js');
    fileList.include('test/**/*test.js');
    jake.Task['test:test'].invoke(fileList.toArray().join(' '), opts||MOCHA_TEST_ALL_OPTS);
  });

  desc('generate test coverage report');
  task('coverage', function (opts) {
    jake.rmRf(JSCOVERAGE_OUT_DIR);
    jake.mkdirP(JSCOVERAGE_OUT_DIR);
    var jscoverageCmd = [JSCOVERAGE, JSCOVERAGE_OPTS, 'lib', JSCOVERAGE_OUT_DIR].join(' ');
    jake.exec(jscoverageCmd, function () {
      jake.Task['test:all'].invoke(opts||MOCHA_TEST_COVERAGE_OPTS);
    }, EXEC_OPTS);
  }, ASYNC);
});

/*
namespace('thrift', function () {
  desc('checkout thrift IDL files from remote git repository');
  task('checkout', function() {
    var gitCmds = [
      'git submodule init',
      'git submodule update',
      'git submodule foreach "git checkout master; git pull origin master"'
    ];
    jake.exec(gitCmds, function () {
      complete();
    }, EXEC_OPTS);
  }, ASYNC);

  desc('generate js files for a thrift IDL file');
  task('thrift', function(file, opts) {
    var thriftCmd = [THRIFT, THRIFT_OPTS, opts||'', file].join(' ');
    jake.exec(thriftCmd, function () {
      complete();
    }, EXEC_OPTS);
  }, ASYNC);

  desc('generate js files for all thrift IDL files');
  task('all', function(opts) {
    jake.Task['thrift:thrift'].invoke('imin-thrift/all.thrift', opts||THRIFT_ALL_OPTS);
  });

});
*/
