/*jslint node:true,white:true,nomen:true */
'use strict';

var Mocha = require('mocha'),
    path = require('path'),
    fs = require('fs'),
    testDir = path.resolve(__dirname, '../test/'),
    testRegex = /_test.js$/,
    mocha = new Mocha({
      reporter: 'spec',
      ui: 'bdd',
      timeout: 999999
    });

fs.readdir(testDir, function (err, files) {
  if (err) {
    console.log(err);
    return;
  }
  files.forEach(function (file) {
    if (testRegex.test(file)) {
      console.log('*** TEST FILE: %s', file);
      mocha.addFile(path.resolve(testDir, file));
    }
  });

  var runner = mocha.run(function () {
    console.log('*** TEST FINISHED');
  });

  runner.on('pass', function (test) {
    console.log('*** TEST %s passed', test.title);
  });
   
  runner.on('fail', function (test) {
    console.log('*** TEST %s failed', test.title);
  });
});
