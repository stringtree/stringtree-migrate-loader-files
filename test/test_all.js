/*jslint node: true */
"use strict";

var test = require('tape');
var path = require('path');
var util = require('util');

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
