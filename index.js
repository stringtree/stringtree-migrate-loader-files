/*jslint node: true */
"use strict";

var util = require('util');
var async = require('async');
var fs = require("fs");
var path = require('path');

function compare_levels(a, b) {
  return Number(a) - Number(b);
}

exports.load = function load(root_path, next) {
  var ret = [];
  fs.readdir(root_path, function(err, levels) {
    if (err) return next(err);

    async.forEach(levels.sort(compare_levels), function(level_string, done) {
      var level_path = path.join(root_path, level_string);
      var stats = fs.lstatSync(level_path);
      if (err) return done(err);
      if (!stats.isDirectory()) return done();
      if (isNaN(level_string)) return done(new Error('Migrate level ' + level_string + ' is not a number. Migration aborted'));

      var level_number = parseInt(level_string, 10);
      var level = {
        level: level_number,
        up: []
      };

      var steps = fs.readdirSync(level_path);

      async.forEach(steps.sort(), function(step, done) {
        var step_file = path.join(level_path, step);
        fs.readFile(step_file, "utf8", function (err,data) {
          if (err) return done(err);

          level.up.push(data);
          done();
        });
      }, function(err) {
        if (err) return done(err);

        ret.push(level);
        done();
      });
    }, function(err) {
      next(err, err ? null : ret);
    });
  });
};
