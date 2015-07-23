/*jslint node: true */
"use strict";

var test = require('tape');
var path = require('path');
var util = require('util');
var fs = require('fs');

var rmdir = require('rimraf');

var loader = require('../index');

test('missing folder', function(t) {
  t.plan(1);
  loader.load(path.join(__dirname, '../input/missing'), function(err, scripts) {
    t.ok(err, 'load of missing folder should error');
  });
});

test('valid but empty', function(t) {
  t.plan(2);
  loader.load(path.join(__dirname, '../input/empty'), function(err, scripts) {
    t.error(err, 'load of empty folder should not error');
    t.equal(scripts.length, 0, 'empty folder should give no levels');
  });
});

test('non-numeric level', function(t) {
  t.plan(1);
  loader.load(path.join(__dirname, '../input/not_number'), function(err, scripts) {
    t.ok(err, 'load of non-numeric level should error');
  });
});

test('valid with 1 level 1 step', function(t) {
  t.plan(3);
  loader.load(path.join(__dirname, '../input/test1'), function(err, scripts) {
    t.error(err, 'load of test 1 should not error');
    t.equal(scripts.length, 1, 'test 1 should give 1 level');
    t.equal(scripts[0].up.length, 1, 'test 1 should give 1 script');
  });
});

test('valid with 2 level 2 step', function(t) {
  t.plan(4);
  loader.load(path.join(__dirname, '../input/test2'), function(err, scripts) {
    t.error(err, 'load of test 2 should not error');
    t.equal(scripts.length, 2, 'test 1 should give 2 levels');
    t.equal(scripts[0].up.length, 1, 'test 1 should give 1 script in level 1');
    t.equal(scripts[1].up.length, 2, 'test 1 should give 2 scripts in level 2');
  });
});

test('strange file sort order', function(t) {
  t.plan(10);
  var tmp = path.join(__dirname, '../tmp/A');
  rmdir.sync(tmp);

  fs.mkdirSync(tmp);

  fs.mkdirSync(path.join(tmp, '2'));
  fs.writeFileSync(path.join(tmp, '2/z'), 'po');
  fs.writeFileSync(path.join(tmp, '2/a'), 'lala');

  fs.mkdirSync(path.join(tmp, '1'));
  fs.writeFileSync(path.join(tmp, '1/23'), "dipsy");
  fs.writeFileSync(path.join(tmp, '1/12'), "tinky-winky");

  loader.load(tmp, function(err, scripts) {
    t.error(err, 'load of out-of-order levels should not error');
    t.equal(scripts.length, 2, 'should give 2 levels');
    t.equal(scripts[0].level, 1, 'should read level 1 first');
    t.equal(scripts[0].up.length, 2, 'should give 2 scripts in level 1');
    t.equal(scripts[1].level, 2, 'should read level 2 next');
    t.equal(scripts[1].up.length, 2, 'should give 2 scripts in level 2');

    t.equal(scripts[0].up[0], 'tinky-winky', 'should give scripts in correct order 1');
    t.equal(scripts[0].up[1], 'dipsy', 'should give scripts in correct order 2');
    t.equal(scripts[1].up[0], 'lala', 'should give scripts in correct order 3');
    t.equal(scripts[1].up[1], 'po', 'should give scripts in correct order 4');
  });
});
