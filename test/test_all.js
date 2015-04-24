/*jslint node: true */
"use strict";

var test = require('tape');
var util = require('util');
var async = require('async');
var fs = require("fs");

function load(path, next) {
	var ret = [];
	fs.readdir(path, function(err, files) {
		console.log(util.inspect(files));
	});
}

load('../input/test1', function(err, scripts) {
	console.log(util.inspect(scripts));
});